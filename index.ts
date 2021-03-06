import '@logseq/libs';
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

const keyDef  = "y y"
const keyStop = "y s"
const pluginName = ["logseq-cinematograph", "Logseq Cinematograph"]
let settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "keyBinding",
    type: 'string',
    default: keyDef,
    title: `${pluginName[1]} toggle keybinding`,
    description: `Keybinding toggles ${pluginName[1]} on and off, defaults to ${keyDef}`,
  },    
  {
    key: "keyStop",
    type: 'string',
    default: keyStop,
    title: `${pluginName[1]} Stop Video keybinding`,
    description: `Keybinding stops all videos on the page`,
  },  
  {
    key: "ytWidth",
    type: 'number',
    default: 720,
    title: "Youtube frame width",
    description: "Minimal recommended width is 480 pixels",
  },
  {
    key: "ytHeight",
    type: 'number',
    default: 405,
    title: "Youtube frame height",
    description: "Minimal recommended height is 270 pixels",
  },
  {
    key: "emoji",
    type: 'string',
    default: "⏱",
    title: "Note taking Emoji",
    description: "Emoji printed when transcribing video",
  }]

async function stopVideo() {
  let videos = parent.document.querySelectorAll('iframe, video');
  Array.prototype.forEach.call(videos, function (video) {
    if (video.tagName.toLowerCase() === 'video') {
      video.pause();
    } else {
      let src = video.src;
      video.src = src;
    }
  });
}

async function toggleUI(e) {
  // enable view
  const elements1 = Array.from(parent.document.getElementsByTagName("iframe"))
  let element2 = elements1[0].closest(".block-content-wrapper").closest(".block-children .w-full")
  element2.classList.toggle("ytcomment");
  const cinOn = `
    /* iframe[id^="youtube-player"] {
      width: ${logseq.settings.ytWidth}px;
      height: ${logseq.settings.ytHeight}px;
    }  */

    .ytcomment .block-children-container .block-children>.ls-block
    {
      display: none !important;
      transition: .4s ease;  
    }
    
    .ytcomment .block-children>.ls-block:last-child {
      display: contents !important;
      transition: .4s ease;  
    }
        
    .ytcomment {
      background-color: var(--ls-secondary-background-color);
    }
    
    .ytcomment .block-children-container .flex:last-of-type {
      font-size: 1.07em;
    }

    .ytcomment .block-children-container .flex:last-of-type::before {
      content: "${logseq.settings.emoji}";
      width: 1em;
      position: absolute;
      left: 18px;
    }`
  logseq.provideStyle(cinOn);
  logseq.App.showMsg(`Toggled ${pluginName[1]}`)
  }
  

const main = async () => {
  logseq.provideModel({
  })
  console.log(`Plugin: ${pluginName[1]} loaded`);
  await logseq.useSettingsSchema(settingsTemplate)

  // const provideStyle = () => logseq.provideStyle(XXX);

  // logseq.onSettingsChanged((_updated) => {
    // provideStyle()
  // }); 

  logseq.App.registerCommandPalette({
    key: "cinematograph-t",
    label: "Toggle study view",
    keybinding: {
      mode: 'global',
      binding: logseq.settings.keyBinding
    }
  }, async (e) => { toggleUI() }); 

  //Still doesn't work correctly
  // logseq.App.registerCommandPalette({
  //   key: "cinematograph-s",
  //   label: "Stop Video",
  //   keybinding: {
  //     mode: 'global',
  //     binding: logseq.settings.keyStop
  //   }
  // }, async (e) => { stopVideo() });
}

logseq.ready(main).catch(console.error);
