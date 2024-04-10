import { Button } from '@mui/material';
import axios from 'axios';
import Arrow from '../Assets/Arrow';

type DataValue = string | number | boolean | Array<any> | { [key: string]: any };

const RenderButton = (data: { [key: string]: DataValue }, level: number = 0, path: string = ''): JSX.Element[] => {
  const handleClick = async (fullPath: string, value: DataValue) => {
    console.log("Post Data to server:", fullPath, value);

    try {
      const response = await axios.post('http://localhost:3030/data', {
        key: fullPath,
        value,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const getVariant = (level: number) => (level % 2 === 0 ? 'contained' : 'outlined');

  const renderArray = (array: Array<any>, key: string, level: number, currentPath: string) => array.map((item, idx) => {
    const itemKey = `${key}-${idx}`;
    const newPath = `${currentPath}.${itemKey}`;
    const isNestedObject = typeof item === 'object' && item !== null;

    if (isNestedObject) {
      return RenderButton({ [itemKey]: item }, level + 1, newPath.slice(1)); // Remove the initial '.' for nested objects
    } else {
      return (
        <Button
          key={itemKey}
          onClick={() => handleClick(newPath, item)}
          variant={getVariant(level)}
          style={{ marginLeft: `${level * 20}px`, marginBottom: '5px' }}
        >
          {`${key} ${idx + 1}`}
        </Button>
      );
    }
  });

  return Object.entries(data).map(([key, value], index) => {
    const uniqueKey = `${level}-${key}-${index}`;
    const isNestedObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const currentPath = path ? `${path}.${key}` : key; // Construct the current path

    return (
      <div key={uniqueKey} style={{ display: 'block', marginBottom: '5px' }}>
        {isArray ? (
          renderArray(value, key, level, currentPath)
        ) : (
          <>
            <Button
              onClick={() => handleClick(currentPath, value)}
              variant={getVariant(level)}
              style={{
                display: 'block',
                width: 'fit-content',
                marginLeft: `${level * 20}px`,
                marginBottom: '5px',
                position: 'relative',
              }}
            >
              {key}
              {level !== 0 && <Arrow />}
            </Button>
            {isNestedObject && RenderButton(value, level + 1, currentPath)}
          </>
        )}
      </div>
    );
  });
};

export default RenderButton;
