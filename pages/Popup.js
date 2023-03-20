import {useState} from "react";
import styles from './Popup.module.css';

const Popup = ({ onClose, title }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
      console.log('handleSubmit called with inputValue:', inputValue);
    onClose(inputValue);
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    onClose(null);
  };

  return (
<div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
      <div className="popup">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <button type="submit">OK</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
        </div>
  );
};

export default Popup;
