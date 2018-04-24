import * as structure from './settings-struc';
import * as components from './html/components/settings';

export default function() {
    let guiContainer = document.querySelector('.tu-settings-gui');
    let headContainer = document.querySelector('.tu-settings-header');
    let tabContainer = document.querySelector('.tu-settings-tab-container');
    let mainContainer = document.querySelector('.tu-settings-main');
    for (let key in structure) {
        //let key = 'Home';
        // create tab
        tabContainer.insertAdjacentHTML('beforeend', components.tab);
        let curTab = tabContainer.lastElementChild;
        curTab.classList.add('tu-settings-tab-' + key);
        if (tabContainer.children.length == 1) {
            mainContainer.insertAdjacentHTML('beforeend', components.tabContent);
            curTab.classList.add('tu-settings-tab-active');
            render(structure[key]);
        }
        let s = document.createElement('span');
        s.text = key;
        curTab.append(key);
        curTab.onclick = changeActiveTab;
    }

    function changeActiveTab(event) {
        let key = event.target.innerText;
        document.querySelector('.tu-settings-tab-active').classList.remove('tu-settings-tab-active');
        document.querySelector('.tu-settings-tab-' + key).classList.add('tu-settings-tab-active');
        mainContainer.children[0].remove();
        mainContainer.insertAdjacentHTML('beforeend', components.tabContent);
        render(structure[key]);
    }

    function render(obj) {
        let n = 1;
        let tabContent = mainContainer.children[0].children[0].children[0].children[0];
        for (let section in obj) {
            tabContent.insertAdjacentHTML('beforeend', components.section(section, n));
            for (let setting in obj[section]) {
                let s = obj[section][setting];
                if (s.type == 'checkbox') {
                    let checkbox = components.checkbox(setting, s.name, s.desc);
                    tabContent.insertAdjacentHTML('beforeend', checkbox);
                    document.getElementById(setting).checked = s.default;
                }
            }
            n++;
        }
    }
}
