import React, { useState } from 'react';

function CountryPag(props) {
    const [currentPage, setCurrentPage] = useState(1);

    const ChangePage = (page) => {
        setCurrentPage(page);
        props.Paging(page);
    };

    const GetPagesNumber = () => {
        let divs = [];
        let pagesPrev = 2;
        let pagesNext = 2;
        let begin = currentPage - pagesPrev;
        let end = currentPage + pagesNext;
        if (begin <= 0) {
            end += ((begin * -1) + 1);
            begin = 1;
        }
        if (end > props.PagesNumber) {
            begin += props.PagesNumber - end;
            end = props.PagesNumber;
        }
        if (begin <= 0) begin = 1;
        for (let i = begin; i <= end; i++)
            divs.push(<li className={"page-item " + (i === currentPage ? "active" : "")} key={i}><button className="page-link" onClick={() => ChangePage(i)}>{i}</button></li>);
        return divs;
    };

    return (
        <div className="pag">
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    <li className={"page-item " + (currentPage === 1 ? "disabled" : "")}>
                        <button className="page-link" onClick={() => ChangePage(currentPage - 1)}>Anterior</button>
                    </li>
                    {GetPagesNumber()}
                    <li className={"page-item " + (currentPage === props.PagesNumber ? "disabled" : "")}>
                        <button className="page-link" onClick={() => ChangePage(currentPage + 1)}>Próxima</button>
                    </li>
                </ul >
            </nav >
        </div >
    )
};

export default CountryPag;