import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../Country/CountryDetail.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function CountryDetail(props) {
    const history = useHistory();
    const [country, setCountry] = useState({ id: '', name: '', capital: '', area: '', population: '', domain: '', flag: '' });
    const { REACT_APP_ORIGINAL_URL, REACT_APP_EDIT_URL, REACT_APP_AUTH_KEY } = process.env;

    useEffect(() => {
        fetch(REACT_APP_ORIGINAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query { Country(_id: "${props.location.state.id}") {
                                _id name capital area population topLevelDomains { name } flag { svgFile }
                        }}` }),
        })
            .then(resp => resp.json())
            .then(original => {
                const url = REACT_APP_EDIT_URL + '/Country/GetItem?id=' + props.location.state.id;
                const options = { headers: { 'Authorization': 'Basic ' + REACT_APP_AUTH_KEY, 'Content-Type': 'application/json' } };
                axios.get(url, options)
                    .then(edited => {
                        const countryOriginal = original.data.Country[0];
                        const countryEdited = edited.data;
                        const ed = edited.status === 200;
                        setCountry({
                            id: countryOriginal._id,
                            name: countryOriginal.name,
                            capital: ed ? countryEdited.capital : countryOriginal.capital,
                            area: ed ? countryEdited.area : countryOriginal.area,
                            population: ed ? countryEdited.population : countryOriginal.population,
                            domain: countryOriginal.topLevelDomains[0].name,
                            flag: countryOriginal.flag.svgFile
                        });
                    })
                    .catch(error => { alert(error); });
            });
    }, [props.location.state.id]);

    function BackHandler() {
        history.push('/');
    }

    return (
        <div className="mainDiv">
            <div className="flag"><img className="img" src={country.flag} alt=" "></img></div>
            <div>
                <Form>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Nome</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={country.name} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Capital</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={country.capital} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Área</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={country.area} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>População</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={country.population} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm={2}>Top-level Domain</Form.Label>
                        <Col sm={10}><Form.Control type="text" value={country.domain} readOnly /></Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={() => BackHandler()}>Voltar</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default CountryDetail;