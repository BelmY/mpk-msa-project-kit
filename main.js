const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

const dataPath = path.join(app.isPackaged ? path.dirname(process.execPath) : __dirname, '.data');
app.setPath('userData', dataPath);

const lib = require(path.join(__dirname, 'dist', 'lib.cjs'));
let win;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'app.ico');

  win = new BrowserWindow({
    width: 1600,
    height: 980,
    title: 'MSA Project Kit by FJB',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

ipcMain.handle('project:new', async (_event, { name, startDate, hoursPerDay }) => {
  const start = startDate ? new Date(startDate) : new Date();
  const startIso = start.toISOString().split('T')[0];
  const hours = parseInt(hoursPerDay, 10) || 8;
  const minPerDay = hours * 60;
  const minPerWeek = minPerDay * 5;

  const xmlTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Project xmlns="http://schemas.microsoft.com/project">
  <Name>${name || 'New Project'}</Name>
  <Title>${name || 'New Project'}</Title>
  <StartDate>${startIso}T08:00:00</StartDate>
  <FinishDate>${startIso}T17:00:00</FinishDate>
  <ScheduleFromStart>1</ScheduleFromStart>
  <MinutesPerDay>${minPerDay}</MinutesPerDay>
  <MinutesPerWeek>${minPerWeek}</MinutesPerWeek>
  <DaysPerMonth>20</DaysPerMonth>
  <Calendars>
    <Calendar>
      <UID>1</UID>
      <Name>Standard</Name>
      <IsBaseCalendar>1</IsBaseCalendar>
    </Calendar>
  </Calendars>
  <Resources>
    <Resource><UID>1</UID><ID>1</ID><Name>SE/MSA/RAMS Eng</Name><Type>1</Type><StandardRate>38</StandardRate></Resource>
    <Resource><UID>2</UID><ID>2</ID><Name>Senior SE/MSA/RAMS Eng</Name><Type>1</Type><StandardRate>45</StandardRate></Resource>
    <Resource><UID>3</UID><ID>3</ID><Name>Spec SE/HW/SW/MSA/RAMS Eng</Name><Type>1</Type><StandardRate>55</StandardRate></Resource>
    <Resource><UID>4</UID><ID>4</ID><Name>Expert SE/HW/SW/MSA/RAMS Eng</Name><Type>1</Type><StandardRate>65</StandardRate></Resource>
    <Resource><UID>5</UID><ID>5</ID><Name>SE/MSA/Safety/RAMS Manager</Name><Type>1</Type><StandardRate>70</StandardRate></Resource>
    <Resource><UID>6</UID><ID>6</ID><Name>PM</Name><Type>1</Type><StandardRate>55</StandardRate></Resource>
    <Resource><UID>7</UID><ID>7</ID><Name>Senior PM</Name><Type>1</Type><StandardRate>65</StandardRate></Resource>
    <Resource><UID>8</UID><ID>8</ID><Name>QA/PA</Name><Type>1</Type><StandardRate>40</StandardRate></Resource>
    <Resource><UID>9</UID><ID>9</ID><Name>Senior PA/QA</Name><Type>1</Type><StandardRate>50</StandardRate></Resource>
    <Resource><UID>10</UID><ID>10</ID><Name>Expert QAM/PAM</Name><Type>1</Type><StandardRate>60</StandardRate></Resource>
    <Resource><UID>11</UID><ID>11</ID><Name>Material / Licenses</Name><Type>2</Type><StandardRate>1000</StandardRate></Resource>
  </Resources>
  <Tasks>
    <Task>
      <UID>0</UID>
      <ID>0</ID>
      <Name>${name || 'New Project'}</Name>
      <OutlineLevel>0</OutlineLevel>
      <OutlineNumber>0</OutlineNumber>
      <Start>${startIso}T08:00:00</Start>
      <Finish>${startIso}T17:00:00</Finish>
      <Duration>PT${hours}H0M0S</Duration>
      <DurationFormat>21</DurationFormat>
      <PercentComplete>0</PercentComplete>
      <Summary>1</Summary>
      <Milestone>0</Milestone>
    </Task>
    <Task>
      <UID>1</UID>
      <ID>1</ID>
      <Name>KOM / Project Kick-Off</Name>
      <OutlineLevel>1</OutlineLevel>
      <OutlineNumber>1</OutlineNumber>
      <Start>${startIso}T08:00:00</Start>
      <Finish>${startIso}T08:00:00</Finish>
      <Duration>PT0H0M0S</Duration>
      <DurationFormat>21</DurationFormat>
      <PercentComplete>0</PercentComplete>
      <Summary>0</Summary>
      <Milestone>1</Milestone>
    </Task>
    <Task>
      <UID>2</UID>
      <ID>2</ID>
      <Name>Phase 1 - Specification and Design</Name>
      <OutlineLevel>1</OutlineLevel>
      <OutlineNumber>2</OutlineNumber>
      <Start>${startIso}T08:00:00</Start>
      <Finish>${startIso}T17:00:00</Finish>
      <Duration>PT${hours * 5}H0M0S</Duration>
      <DurationFormat>21</DurationFormat>
      <PercentComplete>0</PercentComplete>
      <Summary>0</Summary>
      <Milestone>0</Milestone>
    </Task>
  </Tasks>
</Project>`;

  const project = lib.readMspdi(xmlTemplate);
  const fileName = `${(name || 'New_Project').replace(/\s+/g, '_')}.xml`;
  return { project, fileName };
});

ipcMain.handle('dialog:openProject', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Microsoft Project (*.mpp, *.xml)', extensions: ['mpp', 'xml'] },
      { name: 'All Files (*.*)', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) return null;
  const filePath = result.filePaths[0];
  const bytes = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const project = filePath.toLowerCase().endsWith('.xml') ? lib.readMspdi(bytes.toString('utf8')) : lib.readMpp(bytes);
  return { fileName, project };
});

ipcMain.handle('dialog:exportData', async (_event, { project, format, fileName }) => {
  if (!win || !project) return false;
  let ext = 'xml';
  let filterName = 'MS Project XML (MSPDI)';
  let content = '';
  const cleanName = (fileName || 'project').replace(/\.[^/.]+$/, "");

  if (!project.project) project.project = { name: cleanName };
  if (!project.tasks) project.tasks = [];
  if (!project.resources) project.resources = [];
  if (!project.assignments) project.assignments = [];
  if (!project.calendars) project.calendars = [];

  try {
    content = typeof lib.writeMspdi === 'function' ? lib.writeMspdi(project) : JSON.stringify(project);
  } catch (e) {
    dialog.showErrorBox('Export Error', e.message);
    return false;
  }

  const saveRes = await dialog.showSaveDialog(win, {
    defaultPath: `${cleanName}.${ext}`,
    filters: [{ name: filterName, extensions: [ext] }, { name: 'All Files (*.*)', extensions: ['*'] }]
  });

  if (saveRes.canceled || !saveRes.filePath) return false;
  fs.writeFileSync(saveRes.filePath, content, 'utf8');
  return true;
});

ipcMain.handle('window:print', async (_event, options) => {
  if (!win) return false;
  return new Promise((resolve) => {
    win.webContents.print({ 
      silent: false, 
      printBackground: true, 
      color: true, 
      landscape: true, 
      pageSize: options?.pageSize || 'A3', 
      margins: { marginType: 'printableArea' } 
    }, (success, failureReason) => {
      resolve(success);
    });
  });
});

ipcMain.handle('dialog:exportPdf', async (_event, options) => {
  if (!win) return false;
  const saveRes = await dialog.showSaveDialog(win, {
    defaultPath: `${options.title || 'schedule'}.pdf`,
    filters: [{ name: 'PDF Document (*.pdf)', extensions: ['pdf'] }]
  });
  if (saveRes.canceled || !saveRes.filePath) return false;
  const pdfData = await win.webContents.printToPDF({ printBackground: true, landscape: true, pageSize: options?.pageSize || 'A3', preferCSSPageSize: true });
  fs.writeFileSync(saveRes.filePath, pdfData);
  return true;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
