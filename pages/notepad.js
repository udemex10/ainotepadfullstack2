import React, {useRef, useState} from "react";
import Header from './header';
import {saveAs} from 'file-saver';
import Popup from './Popup';
import HelpPopup from './HelpPopup';

function NotepadApp() {
  const [text, setText] = useState("");
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isAItoolsMenuOpen, setIsAItoolsMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("untitled.txt");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [generateType, setGenerateType] = useState("");
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  //
  //
  //edit menu stuff begins
 const handleSave = () => {
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(file, 'file.txt');
};
  //const handleopen to open a file from local drive or from google drive
 const handleOpen = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
  const result = readerEvent.target.result;
  const text = typeof result === 'string' ? result : new TextDecoder().decode(result);
  setText(text);
    };
  };
  input.click();
};


 const handleSaveAs = () => {
  const content = text;
  const fileName = prompt("Enter file name: ", "untitled.txt");
  const fileExtension = fileName.split(".")[1];
  const blob = new Blob([content], { type: `text/${fileExtension}` });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

  const handleNew = () => {
    setText("");
    setFileName("untitled.txt");
  };
  //file menu stuff ends


  const textAreaRef = useRef(null);

  const handleCut = () => {
    const text = textAreaRef.current.value;
    navigator.clipboard.writeText(text)
      .then(() => {
        textAreaRef.current.value = '';
      })
      .catch((error) => {
        console.error('Failed to cut text: ', error);
      });
  };

  const handleCopy = () => {
    const text = textAreaRef.current.value;
    navigator.clipboard.writeText(text)
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const handlePaste = () => {
    navigator.clipboard.readText()
      .then((text) => {
        textAreaRef.current.value = text;
      })
      .catch((error) => {
        console.error('Failed to paste text: ', error);
      });
  };

  const handleDelete = () => {
    textAreaRef.current.value = '';
  };

  const handleSelectAll = () => {
    textAreaRef.current.select();
  };
//edit  ends
  //
  //
  //View Stuff Begins
    const [zoomLevel, setZoomLevel] = useState(1);
    const zoomIn = () => {
      setZoomLevel(prevZoomLevel => prevZoomLevel + 0.1);
    };
    const zoomOut = () => {
      setZoomLevel(prevZoomLevel => prevZoomLevel - 0.1);
    };
      // Add the openHelpPopup and closeHelpPopup functions
  const openHelpPopup = () => {
    setIsHelpPopupOpen(true);
  };

  const closeHelpPopup = () => {
    setIsHelpPopupOpen(false);
  };
  //view stuff ends
  //
  //
const handleTextChange = (event) => {
  console.log('handleTextChange called with event:', event.target.value);
  const text = event.target.value;
  setText(text);
  console.log('generateType:', generateType);

};
const handleGenerateClick = (type) => {
  console.log('handleGenerateClick called with type:', type);
  setIsPopupOpen(true);
  setGenerateType(type.charAt(0).toUpperCase() + type.slice(1));
};

const handleGenerateSubmit = async (inputValue) => {
  console.log('handleGenerateSubmit called with inputValue:', inputValue);
  await handlePopupClose(inputValue);
  console.log('handleGenerateSubmit completed');
};
const handlePopupClose = async (inputValue) => {
  console.log('handlePopupClose called with inputValue:', inputValue);
  setIsPopupOpen(false);
  if (inputValue !== null) {
    console.log('inputValue is not null');
    console.log('generateType:', generateType);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue, outputType: generateType }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      if (generateType === "Paragraph") {
        console.log('Generated paragraph:', data.result);
        handleTextChange({ target: { value: data.result } });
      } else if (generateType === "TodoList") {
        console.log('Generated todo list:', data.result);
        handleTextChange({ target: { value: data.result } });
      }

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

  } else {
    console.log('inputValue is null');
  }
};




  return (
  <div className="notepad-app h-screen w-full bg-gray-100 flex flex-col">
    <Header />

    <div className="toolbar flex bg-white px-2 py-1">
      <div className="toolbar-item group relative cursor-pointer mr-4 font-semibold"
           onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
           onMouseEnter={() => setIsFileMenuOpen(!isFileMenuOpen)} onMouseLeave={() => setIsFileMenuOpen(isFileMenuOpen)}
      >
          File
        {isFileMenuOpen && (
          <div className="toolbar-item-content absolute left-0 mt-1 bg-white shadow-md rounded-md z-10">
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleOpen}>Open</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleNew}>New</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleSave}>Save</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleSaveAs}>Save as</div>
          </div>
        )}
      </div>

      <div className="toolbar-item group relative cursor-pointer mr-4 font-semibold"
           onClick={() => setIsEditMenuOpen(!isEditMenuOpen)}
          onMouseEnter={() => setIsEditMenuOpen(!isEditMenuOpen)} onMouseLeave={() => setIsEditMenuOpen(isEditMenuOpen)}
      >
        Edit
        {isEditMenuOpen && (
          <div className="toolbar-item-content absolute left-0 mt-1 bg-white shadow-md rounded-md z-10">
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleCut}>Cut</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleCopy}>Copy</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handlePaste}>Paste</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleDelete}>Delete</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={handleSelectAll}>Select-all</div>
          </div>
        )}
      </div>
      <div className="toolbar-item group relative cursor-pointer mr-4 font-semibold"
           onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            onMouseEnter={() => setIsViewMenuOpen(!isViewMenuOpen)} onMouseLeave={() => setIsViewMenuOpen(isViewMenuOpen)}
           onKeyDown={() => setIsViewMenuOpen(!isViewMenuOpen)}
           onKeyUp={() => setIsViewMenuOpen(!isViewMenuOpen)}
      >
        View
        {isViewMenuOpen && (
          <div className="toolbar-item-content absolute left-0 mt-1 bg-white shadow-md rounded-md z-10">
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={zoomIn}>Zoom In</div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={zoomOut}>Zoom Out</div>
          </div>
        )}
      </div>

      <div className="toolbar-item group relative cursor-pointer mr-4 font-semibold"
           onClick={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)}
            onMouseEnter={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)} onMouseLeave={() => setIsAItoolsMenuOpen(isAItoolsMenuOpen)}
      >
        AItools
        {isAItoolsMenuOpen && (
          <div className="toolbar-item-content absolute left-0 mt-1 bg-white shadow-md rounded-md z-10">
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={() => {console.log('Generating todo list...');handleGenerateClick("todoList");}}>
              Generate a to-do list
            </div>
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={() => {console.log('Generating paragraph...');handleGenerateClick("paragraph");}}>
              Generate paragraph
            </div>
          </div>
        )}
      </div>
      <div className="toolbar-item group relative cursor-pointer mr-4 font-semibold"
                 onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
            onMouseEnter={() => setIsHelpMenuOpen(!isHelpMenuOpen)} onMouseLeave={() => setIsHelpMenuOpen(isHelpMenuOpen)}>
        Help
        {isHelpMenuOpen && (
          <div className="toolbar-item-content absolute left-0 mt-1 bg-white shadow-md rounded-md z-10">
            <div className="toolbar-item-content-item px-4 py-2 hover:bg-gray-200" onClick={openHelpPopup} >About</div>
          </div>
        )}
      </div>
    </div>
    {isHelpPopupOpen && <HelpPopup onClose={closeHelpPopup} />}
{isPopupOpen && <Popup onClose={handleGenerateSubmit} title="Enter a word or phrase" />}
    <textarea
      className="notepad-textarea flex-1 p-4 text-lg border-none resize-none outline-none bg-white"
      ref={textAreaRef}
      value={text}
       onChange={handleTextChange}
    />
  </div>

);

}

export default NotepadApp;
