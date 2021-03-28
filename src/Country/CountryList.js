import React, { useState, useEffect } from 'react';
import '../Country/CountryList.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function CountryList() {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const filter = filterName === '' ? '' : '(name: "' + filterName + '")';
    const query = `
    query  {
      Country ${filter} {
        _id name capital flag { svgFile }
      }
    }
    `;
    fetch('https://countries-274616.ew.r.appspot.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(r => r.json())
      .then(initial => {
        const url = 'http://localhost:56807/country/GetAll';
        const options = { headers: { 'Authorization': 'Basic YWRtOjEyMw==', 'Content-Type': 'application/json' } };
        axios.get(url, options)
          .then(edited => {
            const items = [];
            initial.data.Country.map((original) => {
              const ed = edited.data.find(e => e.id == original._id);
              items.push({
                id: original._id,
                name: original.name,
                capital: ed === undefined ? original.capital : ed.capital,
                flag: original.flag.svgFile,
                edited: ed === undefined ? 0 : 1
              });
              return false;
            });
            setList(items);
          })
          .catch(error => {
            alert(error);
          });
      });
  }, [filterName]);

  function EditHandler(id) {
    history.push('/edit', { id: id });
  }

  function DetailHandler(id) {
    history.push('/detail', { id: id });
  }

  const Flags = list.map(i => {
    return <div className="card" key={i.id}>
      <p><img className="flag" src={i.flag} alt=" "></img></p>
      <p className="name">{i.name}</p>
      <p>({i.capital})</p>
      <p className="action">
        <button className="btn btn-link btn-sm" onClick={() => EditHandler(i.id)}> Editar</button>
        <button className="btn btn-link btn-sm" onClick={() => DetailHandler(i.id)}>Detalhes</button>
      </p>
      {i.edited === 1 ? <p>Editado</p> : null}
    </div>;
  });

  return (
    <React.Fragment>
      <p>País:<input onChange={(e) => setFilterName(e.target.value)} ></input></p>
      <div className="list">
        {Flags}
      </div>
    </React.Fragment>
  );
}

export default CountryList;