import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { SpriteIcon } from '../common/SpriteIcon';

interface NameFilterBarProps {
  placeholder?: string;
  onFilter: (value: string) => void;
}

export function NameFilterBar({ placeholder = 'User Name', onFilter }: NameFilterBarProps) {
  const [value, setValue] = useState('');

  const handleFilter = () => onFilter(value.trim());

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
      <TextField
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
        sx={{ minWidth: 220, flex: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilter}
        startIcon={<SpriteIcon name="filter" size={18} />}
      >
        Filter
      </Button>
    </Box>
  );
}
