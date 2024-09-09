'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sort } from 'fast-sort';
import { Plus, Save, X } from 'lucide-react';

type TableRow = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
};

const data: TableRow[] = [
  {
    id: crypto.randomUUID(),
    firstName: 'John',
    lastName: 'Doe',
    position: 'Developer',
    phone: '(626) 555-1234',
    email: 'john_doe@example.com',
  },
  {
    id: crypto.randomUUID(),
    firstName: 'Jane',
    lastName: 'Doe',
    position: 'Designer',
    phone: '(626) 512-1563',
    email: 'jane_doe@example.com',
  },
  {
    id: crypto.randomUUID(),
    firstName: 'Bob',
    lastName: 'Smith',
    position: 'Manager',
    phone: '(626) 545-7542',
    email: 'bob_smith@example.com',
  },
];

const EditableTable = () => {
  const [updatedCells, setUpdatedCells] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [sortedData, setSortedData] = useState<TableRow[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableRow;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const [newRow, setNewRow] = useState<TableRow | null>(null);
  const [isAddingRow, setIsAddingRow] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: { data: sortedData },
    mode: 'onChange',
  });

  const handleInputChange = (rowId: string, field: keyof TableRow) => {
    setUpdatedCells((prev) => ({
      ...prev,
      [`${rowId}-${field}`]: true,
    }));
  };

  const onSubmit = (formData: { data: TableRow[] }) => {
    const updatedData = formData.data;

    if (newRow) {
      setSortedData([...sortedData, newRow]);
      setNewRow(null);
      setIsAddingRow(false);
    }

    console.log('Saved Data:', updatedData);
    reset({ data: updatedData });
    setUpdatedCells({});
  };

  const handleReset = () => {
    reset({ data });
    setNewRow(null);
    setIsAddingRow(false);
    setUpdatedCells({});
  };

  const requestSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedArray =
      direction === 'ascending'
        ? sort(data).asc((d) => d[key])
        : sort(data).desc((d) => d[key]);

    setSortedData(sortedArray);
  };

  const handleAddNewRow = () => {
    if (!isAddingRow) {
      const newRowData = {
        id: crypto.randomUUID(),
        firstName: '',
        lastName: '',
        position: '',
        phone: '',
        email: '',
      };
      setNewRow(newRowData);
      setIsAddingRow(true);
    }
  };

  return (
    <div className="relative overflow-x-auto flex flex-col">
      <div className="self-end space-x-2">
        <Button onClick={handleReset} disabled={!isDirty && !isAddingRow}>
          <X />
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || !isValid}
        >
          <Save />
        </Button>
        <Button onClick={handleAddNewRow} disabled={isAddingRow}>
          <Plus />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => requestSort('firstName')}
              className="cursor-pointer"
            >
              First Name
            </TableHead>
            <TableHead
              onClick={() => requestSort('lastName')}
              className="cursor-pointer"
            >
              Last Name
            </TableHead>
            <TableHead
              onClick={() => requestSort('position')}
              className="cursor-pointer"
            >
              Position
            </TableHead>
            <TableHead
              onClick={() => requestSort('phone')}
              className="cursor-pointer"
            >
              Phone
            </TableHead>
            <TableHead
              onClick={() => requestSort('email')}
              className="cursor-pointer"
            >
              Email
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newRow && (
            <TableRow key={newRow.id}>
              {['firstName', 'lastName', 'position', 'phone', 'email'].map(
                (field) => (
                  <TableCell key={field} className="relative">
                    <Controller
                      control={control}
                      name={`data.${sortedData.length}.${
                        field as keyof TableRow
                      }`}
                      rules={{
                        required: `${field} cannot be empty`,
                        pattern:
                          field === 'email'
                            ? {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address',
                              }
                            : field === 'phone'
                            ? {
                                value: /^[\d\s()-]+$/,
                                message:
                                  'Phone number can only contain digits, spaces, dashes, and parentheses.',
                              }
                            : undefined,
                        maxLength:
                          field === 'phone'
                            ? {
                                value: 20,
                                message:
                                  'Phone number cannot exceed 20 characters',
                              }
                            : undefined,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          value={value?.toString() || ''}
                          onChange={(e) => {
                            onChange(e.target.value);
                            handleInputChange(
                              newRow.id,
                              field as keyof TableRow
                            );
                            setNewRow((prevRow) => ({
                              ...prevRow!,
                              [field]: e.target.value,
                            }));
                          }}
                          className={
                            updatedCells[`${newRow.id}-${field}`]
                              ? 'bg-yellow-100'
                              : errors?.data?.[sortedData.length]?.[
                                  field as keyof TableRow
                                ]
                              ? 'bg-red-100'
                              : ''
                          }
                        />
                      )}
                    />
                    {errors?.data?.[sortedData.length]?.[
                      field as keyof TableRow
                    ] && (
                      <div className="absolute bg-red-500 text-white text-xs p-1 rounded mt-1 z-10">
                        {
                          errors?.data?.[sortedData.length]?.[
                            field as keyof TableRow
                          ]?.message
                        }
                      </div>
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          )}
          {sortedData.map((row, rowIndex) => (
            <TableRow key={row.id}>
              {['firstName', 'lastName', 'position', 'phone', 'email'].map(
                (field) => (
                  <TableCell key={field} className="relative">
                    <Controller
                      control={control}
                      name={`data.${rowIndex}.${field as keyof TableRow}`}
                      rules={{
                        required: `${field} cannot be empty`,
                        pattern:
                          field === 'email'
                            ? {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address',
                              }
                            : field === 'phone'
                            ? {
                                value: /^[\d\s()-]+$/,
                                message:
                                  'Phone number can only contain digits, spaces, dashes, and parentheses.',
                              }
                            : undefined,
                        maxLength:
                          field === 'phone'
                            ? {
                                value: 20,
                                message:
                                  'Phone number cannot exceed 20 characters',
                              }
                            : undefined,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          value={value?.toString() || ''}
                          onChange={(e) => {
                            onChange(e.target.value);
                            handleInputChange(row.id, field as keyof TableRow);
                          }}
                          className={
                            updatedCells[`${row.id}-${field}`]
                              ? 'bg-yellow-100'
                              : errors?.data?.[rowIndex]?.[
                                  field as keyof TableRow
                                ]
                              ? 'bg-red-100'
                              : ''
                          }
                        />
                      )}
                    />
                    {errors?.data?.[rowIndex]?.[field as keyof TableRow] && (
                      <div className="absolute bg-red-500 text-white text-xs p-1 rounded mt-1 z-10">
                        {
                          errors.data[rowIndex][field as keyof TableRow]
                            ?.message
                        }
                      </div>
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EditableTable;
