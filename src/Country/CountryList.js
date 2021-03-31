import React, { useState, useEffect } from 'react';
import '../Country/CountryList.css';
import CountryPag from "./CountryPag";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

function CountryList() {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagesNumber, setPagesNumber] = useState();
  const { REACT_APP_ORIGINAL_URL, REACT_APP_EDIT_URL, REACT_APP_AUTH_KEY, REACT_APP_FLAGS_PER_PAGE } = process.env;

  useEffect(() => {
    LoadTotalRows();
  }, [filterName]);

  const LoadTotalRows = () => {
    const filter = filterName === '' ? '' : '(name: "' + filterName + '")';
    fetch(REACT_APP_ORIGINAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `query { Country ${filter} { _id }}` }),
    }).then(resp => resp.json()).then(original => {
      const lenght = parseInt(original.data.Country.length);
      setPagesNumber(lenght / REACT_APP_FLAGS_PER_PAGE);
      LoadList(1);
    });
  }

  const LoadList = (currentPage) => {
    let filter = '(orderBy: name_asc, offset: ' + ((parseInt(currentPage) - 1) * parseInt(REACT_APP_FLAGS_PER_PAGE)) + ', first: ' + REACT_APP_FLAGS_PER_PAGE;
    filter = filter + (filterName === '' ? '' : ', name: "' + filterName + '"');
    filter = filter + ')';
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
  };

  function EditHandler(id) {
    history.push('/edit', { id: id });
  }

  function DetailHandler(id) {
    history.push('/detail', { id: id });
  }

  const Paging = (page) => {
    LoadList(page);
  }

  const Cards = list.map(i => {
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
          {Cards}
        </div>
        <div>
          <CountryPag Paging={Paging} PagesNumber={pagesNumber}></CountryPag>
        </div>
      </div>
      }
    </React.Fragment>
  );
}

export default CountryList;