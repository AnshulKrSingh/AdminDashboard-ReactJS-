import React, { useEffect, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import './BookTable.css'; // Import the CSS file
import { fetchBooks } from './apiService';

// src/BookTable.js

const BookTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSizeState] = useState(10);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const books = await fetchBooks(page, pageSize);
                setData(books);
                setFilteredData(books);
            } catch (error) {
                console.error('Error loading data:', error);
            }
            setLoading(false);
        };

        loadData();
    }, [page, pageSize]);

    useEffect(() => {
        setFilteredData(
            data.filter(book =>
                book.author_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, data]);

    const columns = React.useMemo(
        () => [
            { Header: 'Ratings Average', accessor: 'ratings_average' },
            { Header: 'Author Name', accessor: 'author_name' },
            { Header: 'Title', accessor: 'title' },
            { Header: 'First Publish Year', accessor: 'first_publish_year' },
            { Header: 'Subject', accessor: 'subject' },
            { Header: 'Author Birth Date', accessor: 'author_birth_date' },
            { Header: 'Author Top Work', accessor: 'author_top_work' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        pageOptions,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize: currentPageSize },
    } = useTable(
        {
            columns,
            data: filteredData,
            initialState: { pageIndex: page - 1, pageSize },
            manualPagination: true,
            pageCount: Math.ceil(100 / pageSize), // Assuming a fixed total of 100 records for demo
        },
        useSortBy,
        usePagination
    );

    const handlePageSizeChange = (size) => {
        setPageSizeState(size);
        setPageSize(size);
    };

    const handleDownloadCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            columns.map(column => column.Header).join(',') + '\n' +
            filteredData.map(row => Object.values(row).join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "books.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <>
            <button onClick={handleDownloadCSV}>Download CSV</button>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by author"
                className="search-input"
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table {...getTableProps()} className="book-table">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div>
                        <button onClick={() => gotoPage(0)} disabled={pageIndex === 0}>
                            {'<<'}
                        </button>
                        <button onClick={() => gotoPage(pageIndex - 1)} disabled={pageIndex === 0}>
                            {'<'}
                        </button>
                        <span>
                            Page{' '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{' '}
                        </span>
                        <button
                            onClick={() => gotoPage(pageIndex + 1)}
                            disabled={pageIndex === pageOptions.length - 1}
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => gotoPage(pageOptions.length - 1)}
                            disabled={pageIndex === pageOptions.length - 1}
                        >
                            {'>>'}
                        </button>
                        <select
                            value={currentPageSize}
                            onChange={e => handlePageSizeChange(Number(e.target.value))}
                        >
                            {[10, 50, 100].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </>
    );
};

export default BookTable;
