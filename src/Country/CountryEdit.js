import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../Country/CountryEdit.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function CountryEdit(props) {
    const history = useHistory();
    const [flag, setFlag] = useState('');
    const [name, setName] = useState('');
    const [capital, setCapital] = useState('');
    const [area, setArea] = useState('');
    const [population, setPopulation] = useState('');
    const [density, setDensity] = useState(0);
    const { REACT_APP_ORIGINAL_URL, REACT_APP_EDIT_URL, REACT_APP_AUTH_KEY } = process.env;

    useEffect(() => {
        Load();
    }, [props.location.state.id]);

    const Load = () => {
        fetch(REACT_APP_ORIGINAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query { Country(_id: "${props.location.state.id}") {
                                _id name capital area population topLevelDomains { name } flag { svgFile } populationDensity
                        }}` })
        }).then(resp => resp.json())
            .then(original => {
                const url = REACT_APP_EDIT_URL + '/Country/GetItem?id=' + props.location.state.id;
                const options = { headers: { 'Authorization': 'Basic ' + REACT_APP_AUTH_KEY, 'Content-Type': 'application/json' } };
                axios.get(url, options)
                    .then(edited => {
                        const countryOriginal = original.data.Country[0];
                        const countryEdited = edited.data;
                        const ed = edited.status === 200;
                        setFlag(countryOriginal.flag.svgFile);
                        setName(countryOriginal.name);
                        setCapital(ed ? countryEdited.capital : countryOriginal.capital);
                        setArea(ed ? countryEdited.area : countryOriginal.area);
                        setPopulation(ed ? countryEdited.population : countryOriginal.population);
                        setDensity(ed ? countryEdited.density : countryOriginal.populationDensity);
                    }).catch(error => { alert(error); });
            });
    }

    const SaveHandler = () => {
        const url = REACT_APP_EDIT_URL + '/Country/Save';
        const data = { id: parseInt(props.location.state.id), capital: capital, area: parseInt(area), population: parseInt(population), density: parseFloat(density) };
        const options = {
            headers: { 'Authorization': 'Basic ' + REACT_APP_AUTH_KEY, 'Content-Type': 'application/json' }
        };
        axios.post(url, data, options)
            .then(() => {
                alert('Dados salvos com sucesso.');
                history.push('/');
            }).catch(error => { alert(error); });
    };

    const BackHandler = () => {
        history.push('/');
    }

    return (
        <div className="mainDiv">
            <div className="flag"><img className="img" src={flag} alt=" "></img></div>
            <div>
                <Form>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Nome</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={name} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Capital</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={capital} onChange={(e) => setCapital(e.target.value)} /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>??rea</Form.Label>
                        <Col sm={10}><Form.Control type="number" value={area} onChange={(e) => setArea(e.target.value)} /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Popula????o</Form.Label>
                        <Col sm={10}><Form.Control type="number" value={population} onChange={(e) => setPopulation(e.target.value)} /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Densidade Demogr??fica</Form.Label>
                        <Col sm={10}><Form.Control type="number" step="any" value={density} onChange={(e) => setDensity(e.target.value)} /></Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={SaveHandler}>Salvar</Button> {' '}
                            <Button onClick={BackHandler}>Voltar</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default CountryEdit;