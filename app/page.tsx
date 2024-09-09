import EditableTable from './EditableTable';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12 ">
      <main className="w-full h-full">
        <EditableTable />
      </main>
    </div>
  );
}
