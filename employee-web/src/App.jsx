import { useState } from 'react'
import './App.css'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import * as React from 'react';
import axios from 'axios';

function App() {

  const [employees, setEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const caseInsensitiveStringSort = (rowA, rowB, columnId) => {
    const a = (rowA.getValue(columnId) ?? "")
      .toString()
      .trim()
      .toLowerCase();
  
    const b = (rowB.getValue(columnId) ?? "")
      .toString()
      .trim()
      .toLowerCase();
  
    return a.localeCompare(b);
  };
  const columns = React.useMemo(
    () => [
      { header: "Employee ID", accessorKey: "employeeId" },
      {
        header: "Name",
        accessorKey: "name",
        sortingFn: caseInsensitiveStringSort,
      },
      {
        header: "Manager",
        accessorKey: "manager",
        sortingFn: caseInsensitiveStringSort,
      },
      { header: "Salary", accessorKey: "salary" },
      { header: "Edit", id : "Edit", accessor : "Edit", enableSorting: false,
        cell:props => (<button className = 'editBtn' onClick = {()=>handleUpdate(props.cell.row.original)}>Edit</button>)
      },
      { header: "Delete", id : "Delete", accessor : "Delete", enableSorting: false,
        cell:props => (<button className = 'deleteBtn' onClick = {()=>handleDelete(props.cell.row.original)}>Delete</button>)
      }
    ],
    []
  );
  // ✅ IMPORTANT: data memo must depend on employees
  const data = React.useMemo(() => employees, [employees]);
  const [employeeData, setEmployeeData] = useState({name: '', manager: '', salary: ''});
  const [showCancel, setShowCancel] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const getAllEmployees = () => {
    axios.get('http://localhost:8080/employees')
      .then((res)=> {
        console.log(res.data);
        setEmployees(res.data);
      })
  }

  const handleUpdate = (employee) => {
    setEmployeeData(employee);
    setShowCancel(true);
  }

  const clearAll = () => {
    setEmployeeData({ name: '', manager: '', salary: '' });
    setShowCancel(false);
    setErrMsg('');
  };

  const handleDelete = async(employee) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this employee?');
    if(isConfirmed){
      await axios.delete(
        `http://localhost:8080/employees/${employee.employeeId}`).then((res)=>{
            console.log(res.data);
            setEmployees(res.data);
      });
    }

    window.location.reload();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setEmployeeData({
      ...employeeData,
      [name]:
        name === "name" || name === "manager"
          ? value.trimStart()
          : value,
    });
  
    setErrMsg("");
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    let errmsg = "";
    if(!employeeData.name || !employeeData.manager || !employeeData.salary){
      errmsg = 'All fields are required';
      setErrMsg(errmsg);
    }
    if((errmsg.length === 0) && employeeData.employeeId){
      const res = await axios.put(
        `http://localhost:8080/employees/${employeeData.employeeId}`,
        employeeData
      );
      // ✅ replace in-place (keeps same table position)
      setEmployees(prev =>
        prev.map(emp =>
          emp.employeeId === employeeData.employeeId ? res.data : emp
        )
      );
    }else if(errmsg.length === 0){
      const res = await axios.post("http://localhost:8080/employees", employeeData);

      // ✅ append new employee to bottom
      setEmployees(prev => [...prev, res.data]);
    }
    clearAll();
  }

  const handleCancel = () => {
    setEmployeeData({name: '', manager: '', salary: ''});
    setShowCancel(false);
  }

  React.useEffect(() => {
    getAllEmployees();
  }, []);
  
  return (
    <>
      <div className="main-container">
        <h3> Full Stack Application using React, Spring Boot, and PostgreSQL</h3>
        {errMsg && <span className = "error">{errMsg}</span>}
        <div className = "add panel">
          <div className = 'addpaneldiv'>
            <label htmlFor = "name">Name</label> <br />
            <input className = 'addpanelinput' value = {employeeData.name} onChange = {handleChange} type = "text" name = "name" id = "name"/>
          </div>
          <div className = 'addpaneldiv'>
            <label htmlFor = "manager">Manager</label> <br />
            <input className = 'addpanelinput' value = {employeeData.manager} onChange = {handleChange} type = "text" name = "manager" id = "manager"/>
          </div>
          <div className = 'addpaneldiv'>
            <label htmlFor = "salary">Salary</label> <br />
            <input className = 'addpanelinput' value = {employeeData.salary} onChange = {handleChange} type = "text" name = "salary" id = "salary"/>
          </div>
          <button className = 'addBtn' onClick = {handleSubmit}> {employeeData.employeeId ? "Update" : "Add"} </button>
          <button className = 'cancelBtn' disabled = {!showCancel} onClick = {handleCancel}>Cancel</button>
        </div>
        <input
          className="searchinput"
          type="search"
          placeholder="Search Employee here"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                
                  {header.column.getCanSort() && (
                    <span>
                      {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                      {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagediv">
        <button
          className="pageBtn"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </button>

        <button
          className="pageBtn"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>

        <span className="idx">
          {pageIndex + 1} of {pageCount}
        </span>

        <button
          className="pageBtn"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>

        <button
          className="pageBtn"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </button>
      </div>
    </>
  )
}

export default App
