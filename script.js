class WindowManager {
    constructor() {
        this.windows = new Set();
        this.activeWindow = null;
        this.initializeWindowControls();
        this.initializeVSCodeApp();
    }

    initializeVSCodeApp() {
        const vscodeApp = this.createVSCodeApp();
        this.windows.add(vscodeApp);
    }

    createVSCodeApp() {
        const vscodeApp = document.createElement('div');
        vscodeApp.className = 'vscode-app window';
        vscodeApp.innerHTML = `
            <div class="window-header">
                <span>Visual Studio Code</span>
                <div class="window-controls">
                    <button class="minimize"><i class="fas fa-minus"></i></button>
                    <button class="maximize"><i class="fas fa-square"></i></button>
                    <button class="close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="vscode-content">
                <div class="vscode-sidebar">
                    <div class="sidebar-icons">
                        <button class="explorer active"><i class="fas fa-folder"></i></button>
                        <button class="search"><i class="fas fa-search"></i></button>
                        <button class="git"><i class="fas fa-code-branch"></i></button>
                    </div>
                    <div class="file-tree">
                        <div class="folder">
                            <span>📁 PROJECT</span>
                            <div class="files">
                                <div class="file" data-file="index.html">📄 index.html</div>
                                <div class="file" data-file="script.js">📄 script.js</div>
                                <div class="file" data-file="styles.css">📄 styles.css</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="editor-container">
                    <div class="tabs">
                        <div class="tab active" data-file="index.html">index.html</div>
                        <div class="tab" data-file="script.js">script.js</div>
                        <div class="tab" data-file="styles.css">styles.css</div>
                        <button id="save-file">Save</button>
                    </div>
                    <textarea id="code-editor" placeholder="Start coding..."></textarea>
                </div>
            </div>
        `;

        document.body.appendChild(vscodeApp);
        this.setupVSCodeInteractions(vscodeApp);
        this.makeWindowDraggable(vscodeApp);
        this.setupWindowControls(vscodeApp);
        this.centerWindow(vscodeApp);

        return vscodeApp;
    }

    setupVSCodeInteractions(vscodeApp) {
        const tabs = vscodeApp.querySelectorAll('.tab');
        const codeEditor = vscodeApp.querySelector('#code-editor');
        const fileTree = vscodeApp.querySelector('.file-tree');
        const saveButton = vscodeApp.querySelector('#save-file');
        const fileContents = {
            'index.html': '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>',
            'script.js': '// JavaScript code here',
            'styles.css': '/* CSS styles here */'
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const fileName = tab.dataset.file;
                codeEditor.value = fileContents[fileName];
            });
        });

        fileTree.querySelectorAll('.file').forEach(fileEl => {
            fileEl.addEventListener('dblclick', () => {
                const fileName = fileEl.dataset.file;
                tabs.forEach(tab => tab.classList.remove('active'));
                const activeTab = Array.from(tabs).find(tab => tab.dataset.file === fileName);
                activeTab.classList.add('active');
                
                codeEditor.value = fileContents[fileName];
            });
        });

        saveButton.addEventListener('click', () => {
            const activeTab = vscodeApp.querySelector('.tab.active');
            const fileName = activeTab.dataset.file;
            fileContents[fileName] = codeEditor.value;
            if (fileName === 'script.js') {
                this.createCustomAppFromCode(codeEditor.value);
            }
            
            alert(`Saved ${fileName}`);
        });
    }

    createCustomAppFromCode(fileContents) {
        const htmlContent = fileContents['index.html'];
        const cssContent = fileContents['styles.css'];

        const customApp = document.createElement('div');
        customApp.className = 'custom-app window';
        customApp.innerHTML = `
            <div class="window-header">
                <span>Custom Web App</span>
                <div class="window-controls">
                    <button class="minimize"><i class="fas fa-minus"></i></button>
                    <button class="maximize"><i class="fas fa-square"></i></button>
                    <button class="close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="custom-app-content">
                <iframe id="custom-app-frame" style="width:100%; height:calc(100% - 40px); border:none;"></iframe>
            </div>
        `;

        document.body.appendChild(customApp);
        const iframe = customApp.querySelector('#custom-app-frame');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssContent}</style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        iframeDocument.close();
        this.makeWindowDraggable(customApp);
        this.setupWindowControls(customApp);
        this.centerWindow(customApp);
        this.bringToFront(customApp);
        this.windows.add(customApp);
        this.addCustomAppToStartMenu(customApp);
    }

    addCustomAppToStartMenu(customApp) {
        const startMenu = document.getElementById('startMenu');
        const customAppItem = document.createElement('div');
        customAppItem.className = 'menu-item';
        customAppItem.innerHTML = '<i class="fas fa-window-maximize"></i> Custom Web App';
        
        customAppItem.addEventListener('click', () => {
            customApp.style.display = 'block';
            this.centerWindow(customApp);
            this.bringToFront(customApp);
        });

        startMenu.appendChild(customAppItem);
    }

    createBrowserApp() {
        const browserApp = document.createElement('div');
        browserApp.className = 'browser-app window';
        browserApp.style.width = '80vw';
        browserApp.style.height = '80vh';
        browserApp.style.left = '10vw';
        browserApp.style.top = '10vh';
        browserApp.dataset.theme = document.body.dataset.theme; // Apply the current theme
        browserApp.innerHTML = `
            <div class="window-header">
                <span>Browser</span>
                <div class="window-controls">
                    <button class="minimize"><i class="fas fa-minus"></i></button>
                    <button class="maximize"><i class="fas fa-square"></i></button>
                    <button class="close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="browser-content">
                <div class="browser-toolbar">
                    <input type="text" class="address-bar" placeholder="Enter a URL">
                    <button class="go-button">Go</button>
                </div>
                <iframe id="browser-frame" style="width:100%; height:80vh; border:none;"></iframe>
            </div>
            <div class="resize-handle"></div>
        `;
    
        document.body.appendChild(browserApp);
        const browserFrame = browserApp.querySelector('#browser-frame');
        const addressBar = browserApp.querySelector('.address-bar');
        const goButton = browserApp.querySelector('.go-button');
        const resizeHandle = browserApp.querySelector('.resize-handle');
        this.makeWindowDraggable(browserApp);
        this.setupWindowControls(browserApp);
        this.bringToFront(browserApp);
        this.windows.add(browserApp);
        this.addBrowserAppToStartMenu(browserApp);
    
        goButton.addEventListener('click', () => {
            const url = addressBar.value;
            browserFrame.src = url;
        });
    
        addressBar.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const url = addressBar.value;
                browserFrame.src = url;
            }
        });
    
        let isResizing = false;
        let currentWidth, currentHeight, startX, startY, startWidth, startHeight;
    
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX - browserApp.offsetWidth;
            startY = e.clientY - browserApp.offsetHeight;
            startWidth = browserApp.offsetWidth;
            startHeight = browserApp.offsetHeight;
        });
    
        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
    
            currentWidth = e.clientX - startX;
            currentHeight = e.clientY - startY;
    
            browserApp.style.width = `${currentWidth}px`;
            browserApp.style.height = `${currentHeight}px`;
            browserFrame.style.width = '100%';
            browserFrame.style.height = '100%';
        });
    
        window.addEventListener('mouseup', () => {
            isResizing = false;
        });
    
        return browserApp;
    }    

    addBrowserAppToStartMenu(browserApp) {
        const startMenu = document.getElementById('startMenu');
        const browserAppItem = document.createElement('div');
        browserAppItem.className = 'menu-item';
        browserAppItem.innerHTML = '<i class="fas fa-globe"></i> Browser';
        
        browserAppItem.addEventListener('click', () => {
            browserApp.style.display = 'block';
            this.centerWindow(browserApp);
            this.bringToFront(browserApp);
        });

        startMenu.appendChild(browserAppItem);
    }
    initializeWindowControls() {
        document.querySelectorAll('.window').forEach(window => {
            this.makeWindowDraggable(window);
            this.setupWindowControls(window);
            this.centerWindow(window);
        });
    }

    centerWindow(window) {
        if (!window) return;
        const windowWidth = window.offsetWidth;
        const windowHeight = window.offsetHeight;
        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;
        
        window.style.left = `${(screenWidth - windowWidth) / 2}px`;
        window.style.top = `${(screenHeight - windowHeight) / 2}px`;
    }

    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            isDragging = true;
            initialX = e.clientX - window.offsetLeft;
            initialY = e.clientY - window.offsetTop;
            this.bringToFront(window);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                window.style.left = `${currentX}px`;
                window.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    bringToFront(window) {
        this.windows.forEach(w => {
            w.style.zIndex = '1';
        });
        window.style.zIndex = '1000';
        this.activeWindow = window;
    }

    setupWindowControls(window) {
        const minimize = window.querySelector('.minimize');
        const maximize = window.querySelector('.maximize');
        const close = window.querySelector('.close');

        minimize.addEventListener('click', () => {
            window.style.display = 'none';
        });

        maximize.addEventListener('click', () => {
            if (window.classList.contains('maximized')) {
                window.style.top = '50px';
                window.style.left = '50px';
                window.style.width = '800px';
                window.style.height = '600px';
                window.classList.remove('maximized');
            } else {
                window.style.top = '0';
                window.style.left = '0';
                window.style.width = '100%';
                window.style.height = 'calc(100vh - 50px)';
                window.classList.add('maximized');
            }
        });

        close.addEventListener('click', () => {
            window.style.display = 'none';
        });
    }
}

class WindowsManager {
    setupVSCodeInteractions(vscodeApp) {
        const tabs = vscodeApp.querySelectorAll('.tab');
        const codeEditor = vscodeApp.querySelector('#code-editor');
        const fileTree = vscodeApp.querySelector('.file-tree');
        const saveButton = vscodeApp.querySelector('#save-file');
        const createAppButton = document.createElement('button');
        createAppButton.textContent = 'Create App';
        createAppButton.id = 'create-app-btn';
        createAppButton.style.marginLeft = '10px';
        createAppButton.style.background = '#007ACC';
        createAppButton.style.color = 'white';
        createAppButton.style.border = 'none';
        createAppButton.style.padding = '5px 10px';
        const fileContents = {
            'index.html': '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>',
            'script.js': '// JavaScript code here',
            'styles.css': '/* CSS styles here */'
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const fileName = tab.dataset.file;
                codeEditor.value = fileContents[fileName];
            });
        });

        fileTree.querySelectorAll('.file').forEach(fileEl => {
            fileEl.addEventListener('dblclick', () => {
                const fileName = fileEl.dataset.file;
                tabs.forEach(tab => tab.classList.remove('active'));
                const activeTab = Array.from(tabs).find(tab => tab.dataset.file === fileName);
                activeTab.classList.add('active');
                
                codeEditor.value = fileContents[fileName];
            });
        });
        saveButton.parentNode.insertBefore(createAppButton, saveButton.nextSibling);
        createAppButton.addEventListener('click', () => {
            tabs.forEach(tab => {
                const fileName = tab.dataset.file;
                fileContents[fileName] = codeEditor.value;
            });
            this.createCustomAppFromCode(fileContents);
        });
        saveButton.addEventListener('click', () => {
            const activeTab = vscodeApp.querySelector('.tab.active');
            const fileName = activeTab.dataset.file;
            fileContents[fileName] = codeEditor.value;
            
            alert(`Saved ${fileName}`);
        });
    }
}

class FileSystem {
    constructor() {
        this.files = [];
        this.selectedFile = null;
        this.initializeFileSystem();
    }

    initializeFileSystem() {
        this.setupContextMenu();
        this.setupFileOperations();
        this.setupDesktopDrop();
    }

    setupDesktopDrop() {
        const desktop = document.querySelector('.desktop');
        desktop.addEventListener('dragover', (e) => e.preventDefault());
        desktop.addEventListener('drop', (e) => {
            e.preventDefault();
            const fileId = e.dataTransfer.getData('text/plain');
            const file = this.files.find(f => f.id === parseInt(fileId));
            if (file) {
                file.position = {
                    x: e.clientX - desktop.getBoundingClientRect().left,
                    y: e.clientY - desktop.getBoundingClientRect().top
                };
                this.renderFiles();
            }
        });
    }

    createFile(type, name, position = null) {
        const file = {
            id: Date.now(),
            name: name || `New ${type}`,
            type: type,
            content: '',
            created: new Date(),
            position: position
        };
        this.files.push(file);
        this.renderFiles();
    }

    deleteFile(id) {
        this.files = this.files.filter(file => file.id !== id);
        this.renderFiles();
    }

    renderFiles() {
        const container = document.getElementById('filesContainer');
        const desktop = document.querySelector('.desktop');
        container.innerHTML = '';
        desktop.innerHTML = '';
        
        this.files.forEach(file => {
            const fileElement = this.createFileElement(file);
            
            if (file.position) {
                fileElement.style.position = 'absolute';
                fileElement.style.left = `${file.position.x}px`;
                fileElement.style.top = `${file.position.y}px`;
                desktop.appendChild(fileElement);
            } else {
                container.appendChild(fileElement);
            }
        });
    }

    createFileElement(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.draggable = true;
        fileElement.innerHTML = `
            <i class="fas fa-${file.type === 'folder' ? 'folder' : 'file'}"></i>
            <span>${file.name}</span>
        `;
        
        fileElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', file.id);
        });

        fileElement.addEventListener('dblclick', () => {
            if (file.type === 'file' && file.name.endsWith('.txt')) {
                window.textEditor.openFile(file);
            }
        });

        return fileElement;
    }

    setupContextMenu() {
        const contextMenu = document.querySelector('.context-menu');
        const desktop = document.querySelector('.desktop');
        
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = desktop.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;

            document.getElementById('newFile').onclick = () => {
                const name = prompt('Enter file name:');
                if (name) {
                    this.createFile('file', name, { x, y });
                }
                contextMenu.style.display = 'none';
            };
            
            document.getElementById('newFolder').onclick = () => {
                const name = prompt('Enter folder name:');
                if (name) {
                    this.createFile('folder', name, { x, y });
                }
                contextMenu.style.display = 'none';
            };
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                contextMenu.style.display = 'none';
            }
        });
    }

    setupFileOperations() {
        document.getElementById('newFileBtn').addEventListener('click', () => {
            const name = prompt('Enter file name:');
            if (name) this.createFile('file', name);
        });

        document.getElementById('newFolderBtn').addEventListener('click', () => {
            const name = prompt('Enter folder name:');
            if (name) this.createFile('folder', name);
        });

        document.getElementById('deleteBtn').addEventListener('click', () => {
            if (this.selectedFile) {
                this.deleteFile(this.selectedFile.id);
            }
        });
    }
}



class TextEditor {
    constructor() {
        this.currentFile = null;
        this.editor = document.querySelector('.text-editor');
        this.textarea = document.getElementById('editor-textarea');
        this.setupEditor();
    }

    setupEditor() {
        document.getElementById('saveFile').addEventListener('click', () => this.saveFile());
        this.textarea.addEventListener('input', () => this.autoSave());
    }

    openFile(file) {
        this.currentFile = file;
        this.editor.style.display = 'block';
        this.textarea.value = file.content;
        document.getElementById('editor-title').textContent = file.name;
        windowManager.centerWindow(this.editor);
        windowManager.bringToFront(this.editor);
    }

    saveFile() {
        if (this.currentFile) {
            this.currentFile.content = this.textarea.value;
        }
    }

    autoSave() {
        if (this.currentFile) {
            this.currentFile.content = this.textarea.value;
        }
    }
}

class TaskbarManager {
    constructor() {
        this.setupTaskbar();
        this.setupClock();
        this.setupThemeToggle();
    }

    setupTaskbar() {
        const startButton = document.getElementById('startButton');
        const startMenu = document.getElementById('startMenu');
        
        startButton.addEventListener('click', () => {
            startMenu.style.display = 
                startMenu.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
                startMenu.style.display = 'none';
            }
        });

        document.querySelectorAll('.start-menu .menu-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.textContent.includes('Files')) {
                    const fileManager = document.querySelector('.file-manager');
                    fileManager.style.display = 'block';
                    windowManager.centerWindow(fileManager);
                    windowManager.bringToFront(fileManager);
                } else if (item.textContent.includes('Text Editor')) {
                    const textEditor = document.querySelector('.text-editor');
                    textEditor.style.display = 'block';
                    windowManager.centerWindow(textEditor);
                    windowManager.bringToFront(textEditor);
                } else if (item.textContent.includes('VS Code')) {
                    const vscodeApp = document.querySelector('.vscode-app');
                    vscodeApp.style.display = 'block';
                    windowManager.centerWindow(vscodeApp);
                    windowManager.bringToFront(vscodeApp);
                }
                
                startMenu.style.display = 'none';
            });
        });
    }

    setupClock() {
        const updateClock = () => {
            const clock = document.querySelector('.clock');
            const now = new Date();
            clock.textContent = now.toLocaleTimeString();
        };

        setInterval(updateClock, 1000);
        updateClock();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('darkModeToggle');
        document.body.dataset.theme = 'dark';
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.dataset.theme;
            document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
            themeToggle.innerHTML = currentTheme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        });
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    window.windowManager = new WindowManager();
    window.WindowsManager = new WindowsManager();
    window.fileSystem = new FileSystem();
    window.textEditor = new TextEditor();
    window.taskbarManager = new TaskbarManager();
    window.windowManager.createBrowserApp(false);
});
