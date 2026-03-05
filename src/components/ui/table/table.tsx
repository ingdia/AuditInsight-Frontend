import { TableProps } from './table.types';
import { tableStyles } from './table.styles';

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div style={tableStyles.wrapper}>
      <table style={tableStyles.table}>
        <thead style={tableStyles.thead}>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} style={tableStyles.th}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={tableStyles.tr}>
              {columns.map((column) => (
                <td key={String(column.accessor)} style={tableStyles.td}>
                  {String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}