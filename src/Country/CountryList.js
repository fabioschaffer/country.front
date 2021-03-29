import React, { useState, useEffect } from 'react';
import '../Country/CountryList.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
const { REACT_APP_ORIGINAL_URL, REACT_APP_EDIT_URL, REACT_APP_AUTH_KEY } = process.env;

function CountryList() {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filter = filterName === '' ? '' : '(name: "' + filterName + '")';
    const query = `
    query  {
      Country ${filter} {
        _id name capital flag { svgFile }
      }
    }
    `;
    fetch(REACT_APP_ORIGINAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(r => r.json())
      .then(initial => {
        const url = REACT_APP_EDIT_URL + '/country/GetAll';
        const options = { headers: { 'Authorization': 'Basic ' + REACT_APP_AUTH_KEY, 'Content-Type': 'application/json' } };
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
            setLoading(false);
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
      {loading && <p className="loading">Carregando...</p>}
      {!loading && <div>
        <div className="divFilter">
          <Form.Group>
            <Form.Row>
              <Form.Label column sm={2}>Nome País:</Form.Label>
              <Col>
                <Form.Control type="text" placeholder="Filtrar por país (informar nome completo)" onChange={(e) => setFilterName(e.target.value)} />
              </Col>
            </Form.Row>
          </Form.Group>
        </div>
        <div className="list">
          {Flags}
        </div>
      </div>
      }
    </React.Fragment>
  );
}

export default CountryList;