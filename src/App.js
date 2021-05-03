import logo from './logo.png';
import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react';


function App() {
  const [value, set] = useState([]);
  function ImgButton({right, left}){
    const position = value.findIndex((img, index) => img.selected);
    function handleClick(e) {
      if(right && position < value.length - 1) {
        set(
          value.map(
            (img, index) => {
              if(!img.selected && position + 1 === index){
                return {...img, selected: true}
              }
              return {...img, selected: false}
            }
          )
        )
      }
      if(left && position ==! 0) {
        set(
          value.map(
            (img, index) => {
              if(!img.selected && position -1 === index){
                return {...img, selected: true}
              }
              return {...img, selected: false}
            }
          )
        )
      }
    }
    if(position < 0) {
      return <></>; 
    }
    if(right && position < value.length - 1) {
      return <a href="#"><h1 onClick={handleClick} className="arrow right">❯</h1></a>
    } 
    if(left && position ==! 0) {
      return <a href="#"><h1 onClick={handleClick}className="arrow left">❮</h1></a>
    }
    return <></>;
  }
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_QUERO_URL).then(({data}) => {
      const images = data.map((image, index) => {
        if(index === 0) {
          return {...image, selected: true}
        }
        return {...image, selected: false}
      });
      return set(images);
    });
  }, []);
  const selected = value.find(image => image.selected);
  const imgSelected = selected 
    ? (<>
        <img src={selected.url} height="200"/>
        <span>{selected.labels.join('-')}</span>
      </>)
    : undefined;
  const handleSubmit = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(process.env.REACT_APP_API_QUERO_URL, formData).then(
      ({data}) => {
        set([
          {
            ...data,
            selected: true,
          },
          ...value.map(img => img.selected ? {...img, selected: false} : img),
        ]) 
      }
    ).catch(e => console.log(e));
    e.preventDefault();
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <p>
            <button 
              onClick={
                (e) => {
                  document.getElementById('file').click()
                }
              }
            >
              Selecione a imagem
            </button>
            <input 
              id="file"
              name="file"
              accept="image/*"
              type="file"
              className="input"
              onChange={handleSubmit}
            />
          </p>
          {
            imgSelected           
          }
          <ImgButton right />
          <ImgButton left />
      </header>
    </div>
  );
}

export default App;
