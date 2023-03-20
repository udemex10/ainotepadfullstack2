import React, {useRef, useState} from "react";
import Header from './header';
import {saveAs} from 'file-saver';
import Popup from './Popup';


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
  //
  //
  //toolbar/toolbar content starts here
  const notepadAppStyle = {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    width: "90vw",
    backgroundColor: "#f5f5f5"

  };
  //create a hover dropdown menu
  const fileMenuStyle = {
    display: "flex",
    flexDirection: "column",
    height: "2vh",
    width: "2vw",
    backgroundColor: "#f5f5f5"
  };


  const viewMenuStyle = {
    display: "flex", flexDirection: "column",
    height: "2vh",
    width: "2vw",

      backgroundColor : "#f5f5f5"
  };

  const notepadMenuStyle = {
    display: "flex",  flexDirection: "column", height: "100vh", width:  "100vw",
    backgroundColor: "#f5f5f5"
  };

  const toolbarStyle = {
    display: "flex",
    backgroundColor: "#f5f5f5",
    padding: "8px",
    width: "100vw"
  };

  const toolbarItemStyle = {
    display: "flex",
    flexDirection: "column",
    marginRight: "16px",
    cursor: "pointer"
  };

  const toolbarItemLabelStyle = {
    fontWeight: "bold"
  };

  const toolbarItemContentStyle = {
    display: "flex",
    flexDirection: "column",
    marginRight: "2px",
    cursor: "pointer",
    position: "absolute",
    backgroundColor: "white",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.2)",
    zIndex: 1
  };

  const toolbarItemContentItemStyle = {
    padding: "8px 16px"

  };

  const notepadTextareaStyle = {
    flex: 1,
    padding: "16px",
    fontSize: "16px",
    border: "none",
    resize: "none",
    outline: "none",
    backgroundColor: "white"
  };
  //toolbar/toolbar content area ends
  //
  //
//
  //
  //
  //edit area starts here
    const editMenuStyle = {
    display: "flex", flexDirection: "column",
    height: "2vh",
    width: "2vw",
    backgroundColor: "#f5f5f5"
  };
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
  <div className="notepad-app" style={notepadAppStyle}>
    <Header />

    <div className="toolbar" style={toolbarStyle}>
      <div className="toolbar-item" style={toolbarItemStyle}
           onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
           onMouseEnter={() => setIsFileMenuOpen(!isFileMenuOpen)} onMouseLeave={() => setIsFileMenuOpen(isFileMenuOpen)}
           onKeyDown={() => setIsFileMenuOpen(!isFileMenuOpen)}
           onKeyUp={() => setIsFileMenuOpen(!isFileMenuOpen)}
      >
        <div className="toolbar-item-label" style={toolbarItemLabelStyle}>File</div>
        {isFileMenuOpen &&
           <div className="file-menu" style={fileMenuStyle}>
        <div className="toolbar-item-content" style={toolbarItemContentStyle}>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick= {handleOpen}>Open</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick= {handleNew}>New</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleSave}>Save</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleSaveAs}>Save as</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} >turn on suggestions</div>
        </div>
              </div>
        }
      </div>

      <div className="toolbar-item" style={toolbarItemStyle}
           onClick={() => setIsEditMenuOpen(!isEditMenuOpen)}
          onMouseEnter={() => setIsEditMenuOpen(!isEditMenuOpen)} onMouseLeave={() => setIsEditMenuOpen(isEditMenuOpen)}
           onKeyDown={() => setIsEditMenuOpen(!isEditMenuOpen)}
           onKeyUp={() => setIsEditMenuOpen(!isEditMenuOpen)}
      >
        <div className="toolbar-item-label" style={toolbarItemLabelStyle}>Edit</div>
        {isEditMenuOpen &&
            <div className="edit-menu" style={editMenuStyle}>
            <div className="toolbar-item-content" style={toolbarItemContentStyle}>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleCut}>Cut</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleCopy}>Copy</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handlePaste}>Paste</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleDelete}>Delete</div>
          <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={handleSelectAll}>Select-all</div>
        </div>
              </div>
        }
      </div>
      <div className="toolbar-item" style={toolbarItemStyle}
           onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            onMouseEnter={() => setIsViewMenuOpen(!isViewMenuOpen)} onMouseLeave={() => setIsViewMenuOpen(isViewMenuOpen)}
           onKeyDown={() => setIsViewMenuOpen(!isViewMenuOpen)}
           onKeyUp={() => setIsViewMenuOpen(!isViewMenuOpen)}
      >
        <div className="toolbar-item-label" style={toolbarItemLabelStyle}>View</div>
        {isViewMenuOpen &&
            <div className="view-menu" style={viewMenuStyle}>
        <div className="toolbar-item-content" style={toolbarItemContentStyle}>
            <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={zoomIn}>Zoom In</div>
            <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={zoomOut}>Zoom Out</div>
        </div>
           </div>
            }
        </div>
      <div className="toolbar-item" style={toolbarItemStyle}
           onClick={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)}
            onMouseEnter={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)} onMouseLeave={() => setIsAItoolsMenuOpen(isAItoolsMenuOpen)}
           onKeyDown={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)}
           onKeyUp={() => setIsAItoolsMenuOpen(!isAItoolsMenuOpen)}
      >
        <div className="toolbar-item-label" style={toolbarItemLabelStyle}>AItools</div>
        {isAItoolsMenuOpen &&
            <div className="view-menu" style={viewMenuStyle}>
        <div className="toolbar-item-content" style={toolbarItemContentStyle}>
            <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={() => {console.log('Generating todo list...');handleGenerateClick("todoList");}}>Generate a to-do list</div>
            <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle} onClick={() => {console.log('Generating paragraph...');handleGenerateClick("paragraph");}}>Generate paragraph</div>
        </div>
           </div>
            }
        </div>
      <div className="toolbar-item" style={toolbarItemStyle}
                 onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
            onMouseEnter={() => setIsHelpMenuOpen(!isHelpMenuOpen)} onMouseLeave={() => setIsHelpMenuOpen(isHelpMenuOpen)}
           onKeyDown={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
           onKeyUp={() => setIsHelpMenuOpen(!isHelpMenuOpen)}>
        <div className="toolbar-item-label" style={toolbarItemLabelStyle}>Help</div>
         {isHelpMenuOpen &&
            <div className="view-menu" style={viewMenuStyle}>
        <div className="toolbar-item-content" style={toolbarItemContentStyle}>
            <div className="toolbar-item-content-item" style={toolbarItemContentItemStyle}>About</div>
        </div>
           </div>
         }
      </div>
    </div>
{isPopupOpen && <Popup onClose={handleGenerateSubmit} title="Enter a word or phrase" />}
    <textarea
      className="notepad-textarea"
      ref={textAreaRef}
      value={text}
       onChange={handleTextChange}
      style={notepadTextareaStyle}
    />
  </div>

);

}

export default NotepadApp;
