// components/EditableTable.tsx
'use client';

import { useState } from 'react';

type TableRow = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
};

const EditableTable = () => {
  const data: TableRow[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      position: 'Developer',
      phone: '(626) 555-1234',
      email: 'john_doe@example.com',
    },
    // {
    //   id: 2,
    //   firstName: 'Jane',
    //   lastName: 'Doe',
    //   position: 'Designer',
    //   phone: '(626) 555-1234',
    //   email: 'jane_doe@example.com',
    // },
    // {
    //   id: 3,
    //   firstName: 'Bob',
    //   lastName: 'Smith',
    //   position: 'Manager',
    //   phone: '(626) 555-1234',
    //   email: 'bob_smith@example.com',
    // },
  ];

  const [tableData, setTableData] = useState(data);
  const [draftData, setDraftData] = useState(data);
  const [updatedCells, setUpdatedCells] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleInput = (
    e: React.FormEvent<HTMLTableCellElement>,
    rowId: number,
    field: keyof TableRow
  ) => {
    const newValue = e.currentTarget.textContent || '';
    const updatedDraft = draftData.map((row) => {
      return rowId === row.id ? { ...row, [field]: newValue } : row;
    });

    setDraftData(updatedDraft);
    //mark cell edited
    setUpdatedCells((prev) => ({ ...prev, [`${rowId}-${field}`]: true }));
  };

  const isCellUpdated = (rowId: number, field: keyof TableRow) =>
    updatedCells[`${rowId}-${field}`];

  const handleSubmit = () => {
    setTableData(draftData);
    setUpdatedCells({});
    console.log('Submitted');
  };

  return (
    <div className="relative overflow-x-auto flex flex-col">
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end mb-2"
      >
        Submit
      </button>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-900 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              First Name
            </th>
            <th scope="col" className="px-6 py-3">
              Last Name
            </th>
            <th scope="col" className="px-6 py-3">
              Position
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td
                contentEditable
                onInput={(e) => handleInput(e, row.id, 'firstName')}
                className={`
                  ${isCellUpdated(row.id, 'firstName') ? 'bg-yellow-100' : ''} 
                  px-6 py-4 max-w-1
                `}
              >
                {row.firstName}
              </td>
              <td
                contentEditable
                onInput={(e) => handleInput(e, row.id, 'lastName')}
                className={`
                  ${isCellUpdated(row.id, 'lastName') ? 'bg-yellow-100' : ''} 
                  px-6 py-4 max-w-1
                `}
              >
                {row.lastName}
              </td>
              <td
                contentEditable
                onInput={(e) => handleInput(e, row.id, 'position')}
                className={`
                  ${isCellUpdated(row.id, 'position') ? 'bg-yellow-100' : ''} 
                  px-6 py-4 max-w-1
                `}
              >
                {row.position}
              </td>
              <td
                contentEditable
                onInput={(e) => handleInput(e, row.id, 'phone')}
                className={`
                  ${isCellUpdated(row.id, 'phone') ? 'bg-yellow-100' : ''} 
                  px-6 py-4 max-w-1
                `}
              >
                {row.phone}
              </td>
              <td
                contentEditable
                onInput={(e) => handleInput(e, row.id, 'email')}
                className={`
                  ${isCellUpdated(row.id, 'email') ? 'bg-yellow-100' : ''} 
                  px-6 py-4 w-36 
                `}
              >
                {row.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
