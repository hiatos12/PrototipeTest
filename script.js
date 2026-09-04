let boot_page = document.querySelector('.Boot_section');

let desktop = document.querySelector('.Main_Area');
let Desktop_img = desktop.querySelectorAll('.img');

let My_date_Api = new Date();

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const weekdays = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];

let date = `${weekdays[My_date_Api.getDay()]} ${months[My_date_Api.getMonth()]} ${My_date_Api.getDate()} `;

setInterval(() => {
  My_date_Api = new Date();
  const am_pm = My_date_Api.getHours() >= 12 ? 'PM' : 'AM';
  const time = `${My_date_Api.getHours()}:${My_date_Api.getMinutes()}:${My_date_Api.getSeconds()} ${am_pm}`;

  document.querySelector('.Timne').textContent = time;
}, 1000);

let audio_sample = [
  {
    music:
      'https://pagalworld.is/wp-content/uploads/2026/04/Vaari%20Jaavan%20(From%20&quot;Dhurandhar%20The%20Revenge&quot;)%20-%20Vaari%20Jaavan%20(From%20Dhurandhar%20The%20Revenge)%20(128%20kbps).mp3',
    img: 'https://pagalworld.is/wp-content/uploads/2026/04/Dhurandhar-The-Revenge-Hindi-2026-20260409161002-500x500.jpg',
  },
  {
    music:
      'https://pagalworld.is/wp-content/uploads/2026/04/Dhurandhar%20The%20Revenge%20-%20Aari%20Aari%20-%20Dhurandhar%20The%20Revenge%20(128%20kbps).mp3',
    img: 'https://pagalworld.is/wp-content/uploads/2026/04/Dhurandhar-The-Revenge-Hindi-2026-20260409161002-500x500.jpg',
  },
  {
    music:
      'https://pagalworld.is/wp-content/uploads/2026/08/Bairan%20-%20Barsaat%20(128%20kbps)%20-%2026763.mp3',
    img: 'https://pagalworld.is/wp-content/uploads/2026/08/Barsaat-Unknown-2026-20260708180612-500x500.jpg',
  },
  {
    music:
      'https://pagalworld.is/wp-content/uploads/2026/04/Dhurandhar%20-%20Title%20Track%20-%20Dhurandhar%20(128%20kbps).mp3',
    img: 'https://pagalworld.is/wp-content/uploads/2026/04/Dhurandhar-The-Revenge-Hindi-2026-20260409161002-500x500.jpg',
  },
  {
    music:
      'https://pagalworld.is/wp-content/uploads/2026/08/Alaakaa%20Loova%20(From%20&quot;OM%20Chapter%201%20Udhiram%20%20-%20The%20Blood%20Wood&quot;)%20[Hindi]%20-%20Alaakaa%20Loova%20(From%20OM%20Chapter%201%20Udhiram%20%20-%20The%20Blood%20Wood)%20[Hindi]%20(128%20kbps)%20-%2026689.mp3',
    img: 'https://pagalworld.is/wp-content/uploads/2026/08/Alaakaa-Loova-From-OM-Chapter-1-Udhiram-The-Blood-Wood-Hindi-Hindi-2026-20260730045423-500x500.jpg',
  },
];

// App View's
let folder_view = document.querySelector('.folder_view');
let terminal_view = document.querySelector('.terminal_view');
let text_editor_view = document.querySelector('.text_editor_view');
let Music_player_view = document.querySelector('.Music_player_view');
let Video_player_view = document.querySelector('.Video_player_view');
let setting_view = document.querySelector('.setting_view');

// App Title bar
const folder_header = document.querySelector('.folder_haeder');
const terminal_header = document.querySelector('.terminal_haeder');
const text_editor_header = document.querySelector('.text_editor_haeder');
const music_player_header = document.querySelector('.Music_player_haeder');
const video_player_header = document.querySelector('.Video_player_haeder');
const setting_header = document.querySelector('.setting_haeder');

let view_collaction = [
  folder_view,
  terminal_view,
  text_editor_view,
  Music_player_view,
  Video_player_view,
  setting_view,
];

let header_collaction = [
  folder_header,
  terminal_header,
  text_editor_header,
  music_player_header,
  video_player_header,
  setting_header,
];

// App Icon's
let file_mangaer = document.querySelectorAll('.file_mangaer');
let text_editor = document.querySelectorAll('.text_editor');
let terminal = document.querySelectorAll('.terminal');
let music_player = document.querySelectorAll('.music_player');
let video_player = document.querySelectorAll('.video_player');
let setting = document.querySelectorAll('.setting');

function boot() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      boot_page.style.display = 'none';

      startOS();

      console.log('App Loeded By Me');
    }, 2000);
  });
}

function startOS() {
  document.querySelector('.Date').textContent = date;

  folder_manager();
  text_editor_app();
  terminal_app();
  music_app();
  video_app();
  setting_app();

  Drag_and_Drop_App();
  resize_Windows();
  virtual_file();
}

let view_z_index = 1;

view_collaction.forEach(view => {
  view.addEventListener('click', () => {
    view_z_index += 1;
    view.style.zIndex = view_z_index;
  });
});

function resize_Windows() {
  view_collaction.forEach(Current_view => {
    let isResizing = false;

    let current_Mouse_X;
    let current_Mouse_Y;

    let max_Content_Width;
    let max_Content_Height;

    Current_view.addEventListener('mousemove', e => {
      const rect = Current_view.getBoundingClientRect();

      const Right_Border = Math.abs(e.clientX - rect.right) <= 5;
      const Bottom_Border = Math.abs(e.clientY - rect.bottom) <= 5;

      if (!isResizing) {
        if (Right_Border && Bottom_Border) {
          Current_view.style.cursor = 'nwse-resize';
        } else if (Right_Border) {
          Current_view.style.cursor = 'ew-resize';
        } else if (Bottom_Border) {
          Current_view.style.cursor = 'ns-resize';
        } else {
          Current_view.style.cursor = 'default';
        }
      }
    });

    Current_view.addEventListener('mousedown', e => {
      const rect = Current_view.getBoundingClientRect();

      const Right_Border = Math.abs(e.clientX - rect.right) <= 5;
      const Bottom_Border = Math.abs(e.clientY - rect.bottom) <= 5;

      if (Right_Border || Bottom_Border) {
        isResizing = true;

        current_Mouse_X = e.clientX;
        current_Mouse_Y = e.clientY;

        max_Content_Width = rect.width;
        max_Content_Height = rect.height;
      }
    });

    document.addEventListener('mousemove', e => {
      if (!isResizing) return;

      const deltaX = e.clientX - current_Mouse_X;
      const deltaY = e.clientY - current_Mouse_Y;

      const newWidth = max_Content_Width + deltaX;
      const newHeight = max_Content_Height + deltaY;

      Current_view.style.width = `${newWidth}px`;
      Current_view.style.height = `${newHeight}px`;
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });
  });
}

function Drag_and_Drop_App() {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let currentWindow = null;

  header_collaction.forEach(header => {
    let view = header.parentElement;

    header.addEventListener('mousedown', e => {
      isDragging = true;
      currentWindow = view;

      offsetX = e.x - view.offsetLeft;
      offsetY = e.y - view.offsetTop;
    });
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;

    currentWindow.style.left = `${e.clientX - offsetX}px`;
    currentWindow.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    currentWindow = null;
  });
}

function virtual_file() {
  let folder_ui_loop = ``;
  let folder_path_view = document.querySelector('.folder_path');
  let folder_main_section_inner = folder_view.querySelector('.folder_main_section_inner');
  let folder_structure = {
    Desktop: {
      type: 'folder',
      children: {
        'Web OS.lnk': {
          type: 'file',
          content: 'Shortcut to Web OS',
        },
        Projects: {
          type: 'folder',
          children: {
            WebOS: {
              type: 'folder',
              children: {
                src: {
                  type: 'folder',
                  children: {
                    components: {
                      type: 'folder',
                      children: {
                        'FileManager.js': {
                          type: 'file',
                          content: '// File manager component',
                        },
                        'Terminal.js': {
                          type: 'file',
                          content: '// Terminal component',
                        },
                      },
                    },
                    'App.js': {
                      type: 'file',
                      content: '// Main application',
                    },
                  },
                },
                'index.html': {
                  type: 'file',
                  content: '<html></html>',
                },
              },
            },
          },
        },
      },
    },

    Documents: {
      type: 'folder',
      children: {
        Work: {
          type: 'folder',
          children: {
            Projects: {
              type: 'folder',
              children: {
                'WebOS Project': {
                  type: 'folder',
                  children: {
                    Documentation: {
                      type: 'folder',
                      children: {
                        'architecture.md': {
                          type: 'file',
                          content: '# Web OS Architecture',
                        },
                        'features.txt': {
                          type: 'file',
                          content: 'File Manager\nTerminal\nSettings\nBrowser',
                        },
                      },
                    },
                    'README.md': {
                      type: 'file',
                      content: '# Web OS\nA browser-based operating system.',
                    },
                  },
                },
              },
            },
          },
        },

        Personal: {
          type: 'folder',
          children: {
            Notes: {
              type: 'folder',
              children: {
                'ideas.txt': {
                  type: 'file',
                  content: 'Ideas for future projects.',
                },
                'todo.txt': {
                  type: 'file',
                  content: 'Finish Web OS\nAdd more apps',
                },
              },
            },
          },
        },

        'text.txt': {
          type: 'file',
          content: 'Web OS is just UI and JS logic and nothing new.',
        },
      },
    },

    Downloads: {
      type: 'folder',
      children: {
        Software: {
          type: 'folder',
          children: {
            Development: {
              type: 'folder',
              children: {
                'node-installer.exe': {
                  type: 'file',
                  content: 'Node.js installer',
                },
                'code-editor.zip': {
                  type: 'file',
                  content: 'Code editor archive',
                },
              },
            },
          },
        },

        Images: {
          type: 'folder',
          children: {
            Wallpapers: {
              type: 'folder',
              children: {
                'wallpaper.jpg': {
                  type: 'file',
                  content: 'Desktop wallpaper',
                },
                'wallpaper-dark.jpg': {
                  type: 'file',
                  content: 'Dark desktop wallpaper',
                },
              },
            },
          },
        },
      },
    },

    Videos: {
      type: 'folder',
      children: {
        Tutorials: {
          type: 'folder',
          children: {
            JavaScript: {
              type: 'folder',
              children: {
                'basics.mp4': {
                  type: 'file',
                  content: 'JavaScript basics tutorial',
                },
                'advanced.mp4': {
                  type: 'file',
                  content: 'Advanced JavaScript tutorial',
                },
              },
            },
            WebDevelopment: {
              type: 'folder',
              children: {
                'html-css.mp4': {
                  type: 'file',
                  content: 'HTML and CSS tutorial',
                },
              },
            },
          },
        },

        Movies: {
          type: 'folder',
          children: {
            'sample-movie.mp4': {
              type: 'file',
              content: 'Sample movie',
            },
          },
        },
      },
    },

    Music: {
      type: 'folder',
      children: {
        Artists: {
          type: 'folder',
          children: {
            'Artist One': {
              type: 'folder',
              children: {
                Albums: {
                  type: 'folder',
                  children: {
                    'First Album': {
                      type: 'folder',
                      children: {
                        'song-01.mp3': {
                          type: 'file',
                          content: 'First song',
                        },
                        'song-02.mp3': {
                          type: 'file',
                          content: 'Second song',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        Playlists: {
          type: 'folder',
          children: {
            Favorites: {
              type: 'folder',
              children: {
                'favorite-song.mp3': {
                  type: 'file',
                  content: 'Favorite song',
                },
              },
            },
          },
        },
      },
    },

    Pictures: {
      type: 'folder',
      children: {
        Family: {
          type: 'folder',
          children: {
            2025: {
              type: 'folder',
              children: {
                'birthday.jpg': {
                  type: 'file',
                  content: 'Birthday photo',
                },
                'vacation.jpg': {
                  type: 'file',
                  content: 'Vacation photo',
                },
              },
            },
          },
        },

        Wallpapers: {
          type: 'folder',
          children: {
            Desktop: {
              type: 'folder',
              children: {
                Dark: {
                  type: 'folder',
                  children: {
                    'dark-01.jpg': {
                      type: 'file',
                      content: 'Dark wallpaper',
                    },
                    'dark-02.jpg': {
                      type: 'file',
                      content: 'Dark wallpaper 2',
                    },
                  },
                },
                Light: {
                  type: 'folder',
                  children: {
                    'light-01.jpg': {
                      type: 'file',
                      content: 'Light wallpaper',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  let folder_path = ['Home'];
  let temp_forward = null;
  let new_folder_structure = folder_structure;
  let folder_stack = [new_folder_structure];
  let temp_path = folder_path_view.textContent;

  // folder_haeder_Manu BTN
  let backward = folder_view.querySelector('.backward');
  let forward = folder_view.querySelector('.forward');
  let new_folder = folder_view.querySelector('.new_folder');
  let refresh = folder_view.querySelector('.refresh');

  function folder_ui_create() {
    folder_ui_loop = '';
    temp_path = '';

    for (const key in new_folder_structure) {
      if (!Object.hasOwn(new_folder_structure, key)) continue;

      if (new_folder_structure[key].type === 'folder') {
        folder_ui_loop += `
        <div class="folder_main_section_inner_folders" data-folder_file='${key}'>
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/folder-3d-icon-png-download-8511787.png?f=webp" alt="Folder">
        <p>${key}</p>
        </div>
        `;
      } else if (new_folder_structure[key].type === 'file') {
        folder_ui_loop += `
        <div class="folder_main_section_inner_folders" data-folder_file='${key}'>
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/clipboard-3d-icon-png-download-8511778.png" alt="file">
        <p>${key}</p>
        </div>
        `;
      }
    }

    for (const path of folder_path) {
      temp_path += `${path} / `;
    }

    folder_path_view.textContent = temp_path;
    folder_main_section_inner.innerHTML = folder_ui_loop;

    path_Handler();
  }

  folder_ui_create();

  function path_Handler() {
    let file_folders_collaction = folder_main_section_inner.querySelectorAll(
      '.folder_main_section_inner_folders'
    );

    file_folders_collaction.forEach(file_folder => {
      file_folder.addEventListener('dblclick', e => {
        let CurrentIdentity = e.target.dataset.folder_file;

        if (new_folder_structure[CurrentIdentity].type === 'folder') {
          new_folder_structure = new_folder_structure[CurrentIdentity].children;
          folder_stack.push(new_folder_structure);
          folder_path.push(CurrentIdentity);
        } else if (new_folder_structure[CurrentIdentity].type === 'file') {
          alert(new_folder_structure[CurrentIdentity].content);
        }

        folder_ui_create();
      });
    });
  }

  // backward BTN
  backward.addEventListener('click', () => {
    if (folder_stack.length <= 1) {
      return;
    }

    temp_forward = folder_path.pop();
    folder_stack.pop();

    new_folder_structure = folder_stack[folder_stack.length - 1];

    folder_ui_create();
  });

  // forward BTN
  forward.addEventListener('click', () => {
    folder_path.push(temp_forward);
    new_folder_structure = new_folder_structure[temp_forward].children;
    folder_stack.push(new_folder_structure);
    temp_forward = '';

    folder_ui_create();
  });

  new_folder.addEventListener('click', () => {
    let folder_name = prompt('New Folder : ');

    new_folder_structure[folder_name] = {
      type: 'folder',
      children: {},
    };

    console.log(new_folder_structure);
    console.log(folder_structure);

    folder_ui_create();
  });

  refresh.addEventListener('click', () => {
    console.log('click');

    folder_main_section_inner.innerHTML = '';

    setTimeout(() => {
      folder_ui_create();
    }, 50);
  });
}

let folder_manager = () => {
  // Top_Bar Button's
  let folder_Close_button = document.querySelector('.folder_Close_button');
  let folder_Maximize_button = document.querySelector('.folder_Maximize_button');
  let folder_minimize_button = document.querySelector('.folder_minimize_button');

  file_mangaer.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_folder();
    });
  });

  function open_folder() {
    folder_view.style.display = 'flex';
    file_mangaer[0].style.background = '#d4d3d2';
    folder_view.style.top = '22%';
    folder_view.style.left = '0%';

    folder_view.style.width = '700px';
    folder_view.style.height = '550px';
  }

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 'f') {
      open_folder();
    }
  });

  //  close Button
  folder_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    folder_view.style.display = 'none';
    file_mangaer[0].style.background = 'transparent';
  });

  //  maximize Button
  folder_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    folder_view.style.top = '0';
    folder_view.style.left = '0';
    folder_view.style.width = '100%';
    folder_view.style.height = '100%';
    folder_view.style.position = 'absolute';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'none';
    });
  });

  //  minimize Button
  folder_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    folder_view.style.display = 'none';
    file_mangaer[0].style.background = '#d4d3d2';
  });
};

let text_editor_app = () => {
  // Top_Bar Button's
  let text_editor_Close_button = document.querySelector('.text_editor_Close_button');
  let text_editor_Maximize_button = document.querySelector('.text_editor_Maximize_button');
  let text_editor_minimize_button = document.querySelector('.text_editor_minimize_button');

  text_editor.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_text_editor();
    });
  });

  function open_text_editor() {
    text_editor_view.style.display = 'flex';
    text_editor[0].style.background = '#d4d3d2';
    text_editor_view.style.top = '22%';
    text_editor_view.style.left = '14%';

    text_editor_view.style.width = '700px';
    text_editor_view.style.height = '550px';
  }

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 'e') {
      open_text_editor();
    }
  });

  //  close Button
  text_editor_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    text_editor_view.style.display = 'none';
    text_editor[0].style.background = 'transparent';
  });

  //  maximize Button
  text_editor_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    text_editor_view.style.top = '0';
    text_editor_view.style.left = '0';
    text_editor_view.style.width = '100%';
    text_editor_view.style.height = '100%';
    text_editor_view.style.position = 'absolute';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'none';
    });
  });

  //  minimize Button
  text_editor_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    text_editor_view.style.display = 'none';
    text_editor[0].style.background = '#d4d3d2';
  });
};

let terminal_app = () => {
  // Top_Bar Button's
  let terminal_Close_button = document.querySelector('.terminal_Close_button');
  let terminal_Maximize_button = document.querySelector('.terminal_Maximize_button');
  let terminal_minimize_button = document.querySelector('.terminal_minimize_button');

  terminal.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_terminal();
    });
  });

  function open_terminal() {
    terminal_view.style.display = 'flex';
    terminal[0].style.background = '#d4d3d2';

    terminal_view.style.top = '22%';
    terminal_view.style.left = '7%';

    terminal_view.style.width = '700px';
    terminal_view.style.height = '550px';
  }

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 't') {
      open_terminal();
    }
  });

  //  close Button
  terminal_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    terminal_view.style.display = 'none';
    terminal[0].style.background = 'transparent';
  });

  //  maximize Button
  terminal_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    terminal_view.style.top = '0';
    terminal_view.style.left = '0';
    terminal_view.style.width = '100%';
    terminal_view.style.height = '100%';
    terminal_view.style.position = 'absolute';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'none';
    });
  });

  //  minimize Button
  terminal_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    terminal_view.style.display = 'none';
    terminal[0].style.background = '#d4d3d2';
  });
};

let video_app = () => {
  // Top_Bar Button's
  let Video_player_Close_button = document.querySelector('.Video_player_Close_button');
  let Video_player_Maximize_button = document.querySelector('.Video_player_Maximize_button');
  let Video_player_minimize_button = document.querySelector('.Video_player_minimize_button');

  video_player.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_video_player();
    });
  });

  function open_video_player() {
    Video_player_view.style.display = 'flex';
    video_player[0].style.background = '#d4d3d2';

    Video_player_view.style.top = '22%';
    Video_player_view.style.left = '28%';

    Video_player_view.style.width = '650px';
    Video_player_view.style.height = '493px';
  }

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 'v') {
      open_video_player();
    }
  });

  //  close Button
  Video_player_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    Video_player_view.style.display = 'none';
    video_player[0].style.background = 'transparent';
  });

  //  maximize Button
  Video_player_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    Video_player_view.style.top = '0';
    Video_player_view.style.left = '0';
    Video_player_view.style.width = '100%';
    Video_player_view.style.height = '100%';
    Video_player_view.style.position = 'absolute';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'none';
    });
  });

  //  minimize Button
  Video_player_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    Video_player_view.style.display = 'none';
    video_player[0].style.background = '#d4d3d2';
  });
};

let music_app = () => {
  let img = document.querySelector('.music_img');
  let Music_player_Main_center = document.querySelector('.Music_player_Main_center');

  // Top_Bar Button's
  let Music_player_Close_button = document.querySelector('.Music_player_Close_button');
  let Music_player_Maximize_button = document.querySelector('.Music_player_Maximize_button');
  let Music_player_minimize_button = document.querySelector('.Music_player_minimize_button');

  let music_back = document.querySelector('.music_back');
  let music_forward = document.querySelector('.music_forward');
  let music_Pause = document.querySelector('.music_Pause');
  let music_play = document.querySelector('.music_play');

  let play = 0;
  let audio = new Audio(audio_sample[play].music);

  music_player.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_Music_App();
    });
  });

  // App Open
  let open_Music_App = () => {
    Music_player_view.style.display = 'flex';
    music_player[0].style.background = '#d4d3d2';

    Music_player_view.style.top = '22%';
    Music_player_view.style.left = '21%';

    Music_player_view.style.width = '700px';
    Music_player_view.style.height = '550px';
  };

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 'm') {
      open_Music_App();
    }
  });

  //  close Button
  Music_player_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    Music_player_view.style.display = 'none';
    music_player[0].style.background = 'transparent';
  });

  //  maximize Button
  Music_player_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    Music_player_view.style.top = '0';
    Music_player_view.style.left = '0';
    Music_player_view.style.width = '100%';
    Music_player_view.style.height = '100%';
    Music_player_view.style.position = 'absolute';

    Music_player_Main_center.parentElement.style.height = '90%';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'none';
    });
  });

  //  minimize Button
  Music_player_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    Music_player_view.style.display = 'none';
  });

  // Play Btn
  music_play.addEventListener('click', () => {
    img.src = audio_sample[play].img;
    audio.play();
    img.style.height = '100%';

    Music_player_Main_center.parentElement.style.height = '58%';
    Music_player_Main_center.querySelector('h2').style.display = 'none';
    Music_player_Main_center.querySelector('P').style.display = 'none';

    music_play.style.display = 'none';
    music_Pause.style.display = 'block';
  });

  // Pause Btn
  music_Pause.addEventListener('click', () => {
    audio.pause();

    music_play.style.display = 'block';
    music_Pause.style.display = 'none';
  });

  // Forward Btn
  music_forward.addEventListener('click', () => {
    if (play + 1 < audio_sample.length) {
      play += 1;
    } else {
      play = 0;
    }
    img.src = audio_sample[play].img;
    audio.src = audio_sample[play].music;
    audio.play();

    music_play.style.display = 'none';
    music_Pause.style.display = 'block';
  });

  // Backword Btn
  music_back.addEventListener('click', () => {
    if (play === 0) {
      play = audio_sample.length - 1;
    } else {
      play -= 1;
    }
    img.src = audio_sample[play].img;
    audio.src = audio_sample[play].music;
    audio.play();

    music_play.style.display = 'none';
    music_Pause.style.display = 'block';
  });
};

let setting_app = () => {
  document.querySelector('.System_manu').addEventListener('click', e => {
    e.stopPropagation();
    document.querySelector('.system_manu_section').style.display = 'grid';
    document.querySelector('.system_manu_section').style.zIndex = view_z_index;
  });

  window.addEventListener('click', () => {
    document.querySelector('.system_manu_section').style.display = 'none';
  });

  // Top_Bar Button's
  let setting_Close_button = document.querySelector('.setting_Close_button');
  let setting_Maximize_button = document.querySelector('.setting_Maximize_button');
  let setting_minimize_button = document.querySelector('.setting_minimize_button');

  document.querySelector('.os').querySelector('Span').textContent =
    navigator.userAgentData?.platform;
  document.querySelector('.platform').querySelector('Span').textContent = navigator.platform;
  document.querySelector('.lang').querySelector('Span').textContent =
    navigator.language == 'en-US' ? 'English' : navigator.language;

  let off_btn = document.querySelector('.off');
  let reset_btn = document.querySelector('.reset');
  // let reset_btn = document.querySelector('.');

  setting.forEach(app => {
    app.addEventListener('dblclick', () => {
      open_setting_app();
    });
  });

  // Open Setting
  function open_setting_app() {
    setting_view.style.display = 'flex';
    setting[0].style.background = '#d4d3d2';

    setting_view.style.top = '22%';
    setting_view.style.left = '7%';

    setting_view.style.width = '600px';
    setting_view.style.height = '300px';
  }

  window.addEventListener('keydown', e => {
    if (e.metaKey && e.key == 'i') {
      open_setting_app();
    }
  });

  // Power Off
  off_btn.addEventListener('click', x => {
    x.preventDefault();
    console.log('Power Off');

    window.location.href = 'https://github.com/sandip3';
  });

  // Reset
  reset_btn.addEventListener('click', () => {
    // window.open('about:blank');
    location.reload();
  });

  //  close Button
  setting_Close_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    setting_view.style.display = 'none';
    setting[0].style.background = 'transparent';
  });

  //  maximize Button
  setting_Maximize_button.addEventListener('click', () => {
    desktop.style.top = '0';
    desktop.style.left = '0';
    desktop.style.padding = '0';

    setting_view.style.top = '0';
    setting_view.style.left = '0';
    setting_view.style.width = '100%';
    setting_view.style.height = '100%';
    setting_view.style.position = 'absolute';

    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });
    setting[0].style.background = '#d4d3d2';
  });

  //  minimize Button
  setting_minimize_button.addEventListener('click', () => {
    Desktop_img.forEach((img, ind) => {
      img.style.display = 'inline';
    });

    setting_view.style.display = 'none';
    setting[0].style.background = '#d4d3d2';
  });
};

console.log('App Loaded ');

boot();
