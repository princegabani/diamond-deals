import * as XLSX from 'xlsx';
import React, { useState, useMemo } from 'react';

import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';

// ------------------------------
// TYPE
// ------------------------------
interface Diamond {
  id: number;
  origin: 'Natural' | 'Lab Grown';
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  price: number;

  certificate?: string;
  video?: string;
}

// ------------------------------
// COLUMN MAP
// ------------------------------
const COLUMN_MAP: Record<string, string[]> = {
  id: ['id'],
  origin: ['origin', 'type'],
  shape: ['shape', 'cut'],
  carat: ['carat', 'weight', 'ct', 'crt'],
  color: ['color', 'colour'],
  clarity: ['clarity', 'purity'],
  price: ['price', 'amount', 'cost', 'rate', 'value', 'buy total price'],

  certificate: ['certificate', 'certificate url', 'cert'],
  video: ['video', 'video url', 'diamond video'],
};

// ------------------------------
// HELPERS
// ------------------------------
const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, '');

const findValue = (row: any, keys: string[]) => {
  for (const key of keys) {
    const normalized = normalizeKey(key);

    const matchKey = Object.keys(row).find((k) => normalizeKey(k) === normalized);

    if (matchKey && row[matchKey] !== undefined && row[matchKey] !== '') {
      return row[matchKey];
    }
  }
  return undefined;
};

// ------------------------------
// COMPONENT
// ------------------------------
const DiamondFilterList: React.FC = () => {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ------------------------------
  // FILE UPLOAD
  // ------------------------------
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.SheetNames[0];
      const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      const diamondData: Diamond[] = jsonData.map((row, index) => {
        const carat = findValue(row, COLUMN_MAP.carat);
        const price = findValue(row, COLUMN_MAP.price);

        return {
          id: Number(findValue(row, COLUMN_MAP.id)) || index + 1,
          origin: findValue(row, COLUMN_MAP.origin) || 'Natural',
          shape: findValue(row, COLUMN_MAP.shape) || '',
          carat: parseFloat(carat) || 0,
          color: findValue(row, COLUMN_MAP.color) || '',
          clarity: findValue(row, COLUMN_MAP.clarity) || '',
          price: parseFloat(price) || 0,

          certificate: findValue(row, COLUMN_MAP.certificate),
          video: findValue(row, COLUMN_MAP.video),
        };
      });

      setDiamonds(diamondData);
    };

    reader.readAsBinaryString(file);
  };

  // ------------------------------
  // FILTER
  // ------------------------------
  const filteredDiamonds = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return diamonds.filter(
      (d) =>
        d.shape.toLowerCase().includes(q) ||
        d.color.toLowerCase().includes(q) ||
        d.clarity.toLowerCase().includes(q) ||
        d.carat.toString().includes(q)
    );
  }, [diamonds, searchQuery]);

  const openWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const text = encodeURIComponent(message);

    // App URLs
    const whatsappApp = `whatsapp://send?phone=${cleanPhone}&text=${text}`;
    const whatsappBusiness = `whatsapp-business://send?phone=${cleanPhone}&text=${text}`;

    // Web fallback
    const webUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;

    // Try normal WhatsApp first
    window.location.href = whatsappApp;

    // Try Business WhatsApp if normal app fails
    setTimeout(() => {
      window.location.href = whatsappBusiness;
    }, 800);

    // Final fallback to browser
    setTimeout(() => {
      window.open(webUrl, '_blank');
    }, 1600);
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Diamond Inventory
      </Typography>

      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Shape</TableCell>
              <TableCell>Carat</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Clarity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell />
              {/* <TableCell>Certificate</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Chat</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredDiamonds.map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.shape}</TableCell>
                <TableCell>{d.carat}</TableCell>
                <TableCell>{d.color}</TableCell>
                <TableCell>{d.clarity}</TableCell>
                <TableCell>${d.price.toLocaleString()}</TableCell>

                {/* Certificate */}
                <TableCell>
                  {d.certificate ? (
                    <IconButton href={d.certificate} target="_blank" rel="noopener noreferrer">
                      <PictureAsPdfIcon color="error" />
                    </IconButton>
                  ) : (
                    ''
                  )}

                  {/* Video */}
                  {d.video ? (
                    <IconButton href={d.video} target="_blank" rel="noopener noreferrer">
                      <VideoLibraryIcon color="primary" />
                    </IconButton>
                  ) : (
                    ''
                  )}

                  {/* Chat Button */}
                  <Button
                    color="primary"
                    size="small"
                    startIcon={<ChatIcon />}
                    onClick={() => {
                      const message = `
                                        Hi, I’m interested in this diamond:

ID: ${d.id}
Shape: ${d.shape}
Carat: ${d.carat}
Color: ${d.color}
Clarity: ${d.clarity}
Price: $${d.price.toLocaleString()}
    `.trim();

                      openWhatsApp('61404995273', message);
                    }}
                  >
                    {' '}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DiamondFilterList;

// import * as XLSX from 'xlsx';
// import React, { useState, useMemo, useCallback } from 'react';

// import SearchIcon from '@mui/icons-material/Search';
// import {
//   Box,
//   Typography,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from '@mui/material';

// // Diamond Type
// interface Diamond {
//   id: number;
//   origin: 'Natural' | 'Lab Grown';
//   shape: string;
//   carat: number;
//   color: string;
//   clarity: string;
//   price: number;
// }

// const DiamondFilterList: React.FC = () => {
//   const [diamonds, setDiamonds] = useState<Diamond[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Load Excel file
//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target?.result;
//       if (!data) return;

//       const workbook = XLSX.read(data, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

//       // Map Excel rows to Diamond type
//       const diamondData: Diamond[] = jsonData.map((row, index) => ({
//         id: row.ID || index + 1,
//         origin: row.Origin || 'Natural',
//         shape: row.Shape || '',
//         carat: parseFloat(row.Carat) || 0,
//         color: row.Color || '',
//         clarity: row.Clarity || '',
//         price: parseFloat(row.Amount) || 0,
//       }));

//       setDiamonds(diamondData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Filter Diamonds (example: by search query)
//   const filteredDiamonds = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     return diamonds.filter(
//       (d) =>
//         d.shape.toLowerCase().includes(query) ||
//         d.color.toLowerCase().includes(query) ||
//         d.clarity.toLowerCase().includes(query)
//     );
//   }, [diamonds, searchQuery]);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Diamond Inventory
//       </Typography>

//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search by Shape, Color, or Clarity..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         variant="outlined"
//         sx={{ mt: 2, mb: 2 }}
//         InputProps={{
//           startAdornment: <SearchIcon sx={{ mr: 1 }} />,
//         }}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Origin</TableCell>
//               <TableCell>Shape</TableCell>
//               <TableCell align="right">Carat</TableCell>
//               <TableCell>Color</TableCell>
//               <TableCell>Clarity</TableCell>
//               <TableCell align="right">Price</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredDiamonds.map((d) => (
//               <TableRow key={d.id}>
//                 <TableCell>{d.id}</TableCell>
//                 <TableCell>{d.origin}</TableCell>
//                 <TableCell>{d.shape}</TableCell>
//                 <TableCell align="right">{d.carat}</TableCell>
//                 <TableCell>{d.color}</TableCell>
//                 <TableCell>{d.clarity}</TableCell>
//                 <TableCell align="right">${d.price.toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default DiamondFilterList;

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// import React, { useState, useMemo, useCallback } from 'react';

// import SearchIcon from '@mui/icons-material/Search';
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   styled,
//   Chip,
// } from '@mui/material';
// // Diamond Shape Icons (for visual filter)
// import {
//   CircleOutlined as RoundIcon,
//   StarBorder as PrincessIcon,
//   CropSquare as EmeraldIcon,
//   FiberManualRecord as OvalIcon,
//   SquareFoot as CushionIcon,
//   ChangeHistory as PearIcon,
// } from '@mui/icons-material';

// // ----------------------------------------------------------------------------
// // 1. DATA AND TYPES
// // ----------------------------------------------------------------------------

// // Type definitions
// interface Diamond {
//   id: number;
//   origin: 'Natural' | 'Lab Grown';
//   shape: 'Round' | 'Princess' | 'Emerald' | 'Oval' | 'Cushion' | 'Pear';
//   carat: number;
//   color: string;
//   clarity: string;
//   price: number;
// }
// type DiamondFilters = {
//   origin: string[];
//   shape: string[];
//   caratRange: string[];
//   color: string[];
//   clarity: string[];
//   fancy: string[]; // Added 'fancy' filter category
// };

// // Dummy Diamond Data List
// const DIAMOND_DATA: Diamond[] = [
//   {
//     id: 1,
//     origin: 'Natural',
//     shape: 'Round',
//     carat: 1.01,
//     color: 'G',
//     clarity: 'VS1',
//     price: 6500,
//   },
//   {
//     id: 2,
//     origin: 'Lab Grown',
//     shape: 'Oval',
//     carat: 1.55,
//     color: 'D',
//     clarity: 'VVS2',
//     price: 2100,
//   },
//   {
//     id: 3,
//     origin: 'Natural',
//     shape: 'Princess',
//     carat: 0.88,
//     color: 'H',
//     clarity: 'SI1',
//     price: 3100,
//   },
//   {
//     id: 4,
//     origin: 'Lab Grown',
//     shape: 'Cushion',
//     carat: 2.1,
//     color: 'E',
//     clarity: 'IF',
//     price: 4200,
//   },
//   {
//     id: 5,
//     origin: 'Natural',
//     shape: 'Emerald',
//     carat: 1.8,
//     color: 'J',
//     clarity: 'VS2',
//     price: 7800,
//   },
//   {
//     id: 6,
//     origin: 'Lab Grown',
//     shape: 'Round',
//     carat: 0.9,
//     color: 'F',
//     clarity: 'VVS1',
//     price: 1850,
//   },
//   {
//     id: 7,
//     origin: 'Natural',
//     shape: 'Pear',
//     carat: 1.25,
//     color: 'G',
//     clarity: 'VVS2',
//     price: 7100,
//   },
//   {
//     id: 8,
//     origin: 'Lab Grown',
//     shape: 'Oval',
//     carat: 1.15,
//     color: 'Fancy Yellow',
//     clarity: 'VVS1',
//     price: 3500,
//   }, // Fancy diamond
//   {
//     id: 9,
//     origin: 'Natural',
//     shape: 'Round',
//     carat: 1.05,
//     color: 'Fancy Pink',
//     clarity: 'VS2',
//     price: 15000,
//   }, // Fancy diamond
//   {
//     id: 10,
//     origin: 'Lab Grown',
//     shape: 'Princess',
//     carat: 1.4,
//     color: 'Fancy Blue',
//     clarity: 'SI1',
//     price: 6800,
//   }, // Fancy diamond
// ];

// // Filter Options
// const FILTER_OPTIONS = {
//   origin: ['Natural', 'Lab Grown'],
//   shape: ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 'Pear'],
//   caratRange: ['0.5 - 1.0', '1.0 - 1.5', '1.5 - 2.0', '2.0+'],
//   color: ['D-F', 'G-J', 'K-M'],
//   clarity: ['FL-IF', 'VVS1-VVS2', 'VS1-VS2', 'SI1-SI2'],
//   fancy: ['Fancy Yellow', 'Fancy Pink', 'Fancy Blue'], // Added new 'fancy' category
// };

// // Visual Filter Mappings
// const SHAPE_ICONS: { [key: string]: React.ElementType } = {
//   Round: RoundIcon,
//   Princess: PrincessIcon,
//   Emerald: EmeraldIcon,
//   Oval: OvalIcon,
//   Cushion: CushionIcon,
//   Pear: PearIcon,
// };

// const COLOR_GRADES: { label: string; key: string; color: string; borderColor: string }[] = [
//   { label: 'D-F', key: 'D-F', color: '#FFFFFF', borderColor: '#CCC' },
//   { label: 'G-J', key: 'G-J', color: '#FFFFE0', borderColor: '#EEDD82' },
//   { label: 'K-M', key: 'K-M', color: '#F0E68C', borderColor: '#DAA520' },
// ];

// const FANCY_COLORS: { label: string; key: string; color: string }[] = [
//   { label: 'Yellow', key: 'Fancy Yellow', color: '#FFFF00' },
//   { label: 'Pink', key: 'Fancy Pink', color: '#FFB6C1' },
//   { label: 'Blue', key: 'Fancy Blue', color: '#ADD8E6' },
// ];

// // ----------------------------------------------------------------------------
// // 2. STYLING & HELPERS
// // ----------------------------------------------------------------------------

// const FilterButton = styled(Button)(({ theme }) => ({
//   minWidth: 'auto',
//   padding: theme.spacing(0.5, 1.5),
//   marginRight: theme.spacing(1),
//   marginBottom: theme.spacing(1),
//   borderRadius: (theme.shape.borderRadius as number) * 2,
//   color: theme.palette.text.primary,
//   borderColor: theme.palette.divider,
//   '&.active': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     borderColor: theme.palette.primary.main,
//     '&:hover': {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   },
// }));

// const parseCaratRange = (range: string): { min: number; max: number } => {
//   if (range.includes('+')) {
//     return { min: parseFloat(range.replace('+', '')), max: Infinity };
//   }
//   const [minStr, maxStr] = range.split(' - ');
//   return { min: parseFloat(minStr), max: parseFloat(maxStr) };
// };

// // ----------------------------------------------------------------------------
// // 3. MAIN COMPONENT
// // ----------------------------------------------------------------------------

// const DiamondFilterList: React.FC = () => {
//   const [activeFilters, setActiveFilters] = useState<DiamondFilters>({
//     origin: [],
//     shape: [],
//     caratRange: [],
//     color: [],
//     clarity: [],
//     fancy: [],
//   });
//   const [searchQuery, setSearchQuery] = useState('');

//   // ** Filter Handler **
//   const handleFilterToggle = useCallback(
//     (categoryName: keyof DiamondFilters, filterValue: string) => {
//       setActiveFilters((prevFilters) => {
//         const currentCategory = prevFilters[categoryName];
//         const isFilterActive = currentCategory.includes(filterValue);

//         const newCategory = isFilterActive
//           ? currentCategory.filter((value) => value !== filterValue)
//           : [...currentCategory, filterValue];

//         return {
//           ...prevFilters,
//           [categoryName]: newCategory,
//         };
//       });
//     },
//     []
//   );

//   // ** Filtering and Searching Logic (Optimized using useMemo) **
//   const filteredDiamonds = useMemo(() => {
//     let items = DIAMOND_DATA;
//     const query = searchQuery.toLowerCase();

//     // 1. Apply Text Search
//     if (query) {
//       items = items.filter(
//         (diamond) =>
//           diamond.shape.toLowerCase().includes(query) ||
//           diamond.color.toLowerCase().includes(query) ||
//           diamond.clarity.toLowerCase().includes(query)
//       );
//     }

//     // 2. Apply Filters
//     items = items.filter((diamond) => {
//       // Check for simple string matches
//       const isFilterMissing = (category: keyof DiamondFilters, value: string) =>
//         activeFilters[category].length > 0 && !activeFilters[category].includes(value);

//       if (isFilterMissing('origin', diamond.origin)) return false;
//       if (isFilterMissing('shape', diamond.shape)) return false;

//       // Check for Fancy Colors (explicit match)
//       if (activeFilters.fancy.length > 0 && !activeFilters.fancy.includes(diamond.color)) {
//         return false;
//       }

//       // Check Carat Range
//       if (activeFilters.caratRange.length > 0) {
//         const isCaratMatch = activeFilters.caratRange.some((rangeStr) => {
//           const { min, max } = parseCaratRange(rangeStr);
//           return diamond.carat >= min && diamond.carat <= max;
//         });
//         if (!isCaratMatch) return false;
//       }

//       // Check Regular Color Grades (range-based)
//       // This is only applied if no fancy colors are selected
//       if (activeFilters.color.length > 0 && activeFilters.fancy.length === 0) {
//         const isColorMatch = activeFilters.color.some(
//           (rangeStr) =>
//             diamond.color >= rangeStr[0] && diamond.color <= rangeStr[rangeStr.length - 1]
//         );
//         if (!isColorMatch) return false;
//       }

//       // Check Clarity
//       if (activeFilters.clarity.length > 0) {
//         const isClarityMatch = activeFilters.clarity.some((rangeStr) =>
//           rangeStr.includes(diamond.clarity)
//         );
//         if (!isClarityMatch) return false;
//       }

//       return true;
//     });

//     return items;
//   }, [activeFilters, searchQuery]);

//   // ** Render Active Chips **
//   const activeFilterChips = useMemo(
//     () =>
//       Object.entries(activeFilters).flatMap(([category, values]) =>
//         values.map((value) => (
//           <Chip
//             key={`${category}-${value}`}
//             label={`${category.charAt(0).toUpperCase() + category.slice(1)}: ${value}`}
//             onDelete={() => handleFilterToggle(category as keyof DiamondFilters, value)}
//             color="primary"
//             variant="outlined"
//             size="small"
//             sx={{ mr: 1, mb: 1 }}
//           />
//         ))
//       ),
//     [activeFilters, handleFilterToggle]
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Diamond Inventory Dashboard
//       </Typography>

//       {/* Filter Section */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
//           Visual Filters
//         </Typography>

//         {/* Dynamically render filters based on FILTER_OPTIONS object */}
//         {Object.entries(FILTER_OPTIONS).map(([categoryName, options]) => (
//           <Box key={categoryName} sx={{ mb: 3 }}>
//             <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
//               {categoryName.replace(/([A-Z])/g, ' $1').trim()}
//             </Typography>

//             {/* --- VISUAL FILTER: SHAPE --- */}
//             {categoryName === 'shape' ? (
//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 {options.map((option) => {
//                   const IconComponent = SHAPE_ICONS[option];
//                   const isActive = activeFilters.shape.includes(option);
//                   return (
//                     <Box
//                       key={option}
//                       onClick={() => handleFilterToggle('shape', option)}
//                       sx={{
//                         p: 1.5,
//                         border: '2px solid',
//                         borderColor: isActive ? 'primary.main' : 'grey.300',
//                         borderRadius: 2,
//                         cursor: 'pointer',
//                         textAlign: 'center',
//                         transition: 'all 0.2s',
//                         bgcolor: isActive ? 'primary.light' : 'white',
//                         '&:hover': {
//                           bgcolor: isActive ? 'primary.light' : 'grey.50',
//                         },
//                       }}
//                     >
//                       {IconComponent && (
//                         <IconComponent
//                           sx={{ fontSize: 32, color: isActive ? 'primary.dark' : 'text.secondary' }}
//                         />
//                       )}
//                       <Typography
//                         variant="caption"
//                         display="block"
//                         color={isActive ? 'primary.dark' : 'text.secondary'}
//                       >
//                         {option}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             ) : /* --- VISUAL FILTER: COLOR --- */
//             categoryName === 'color' ? (
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 {COLOR_GRADES.map(({ label, key, color, borderColor }) => {
//                   const isActive = activeFilters.color.includes(key);
//                   return (
//                     <Box
//                       key={key}
//                       onClick={() => handleFilterToggle('color', key)}
//                       sx={{
//                         width: 80,
//                         height: 50,
//                         border: '2px solid',
//                         borderColor: isActive ? 'primary.main' : borderColor,
//                         bgcolor: color,
//                         borderRadius: 1,
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'flex-end',
//                         justifyContent: 'center',
//                         p: 0.5,
//                         transition: 'all 0.2s',
//                         boxShadow: isActive ? '0 0 0 3px rgba(0, 123, 255, 0.3)' : 'none',
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: 'text.primary',
//                           fontWeight: 'bold',
//                           bgcolor: 'rgba(255, 255, 255, 0.8)',
//                           px: 0.5,
//                         }}
//                       >
//                         {label}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             ) : /* --- VISUAL FILTER: FANCY --- */
//             categoryName === 'fancy' ? (
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 {FANCY_COLORS.map(({ label, key, color }) => {
//                   const isActive = activeFilters.fancy.includes(key);
//                   return (
//                     <Box
//                       key={key}
//                       onClick={() => handleFilterToggle('fancy', key)}
//                       sx={{
//                         width: 80,
//                         height: 50,
//                         border: '2px solid',
//                         borderColor: isActive ? 'primary.main' : 'grey.300',
//                         bgcolor: color,
//                         borderRadius: 1,
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'flex-end',
//                         justifyContent: 'center',
//                         p: 0.5,
//                         transition: 'all 0.2s',
//                         boxShadow: isActive ? '0 0 0 3px rgba(0, 123, 255, 0.3)' : 'none',
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: 'text.primary',
//                           fontWeight: 'bold',
//                           bgcolor: 'rgba(255, 255, 255, 0.8)',
//                           px: 0.5,
//                         }}
//                       >
//                         {label}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             ) : (
//               /* --- DEFAULT FILTER: OTHERS (Origin, Carat, Clarity) --- */
//               <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
//                 {options.map((option) => (
//                   <FilterButton
//                     key={option}
//                     variant="outlined"
//                     className={
//                       activeFilters[categoryName as keyof DiamondFilters].includes(option)
//                         ? 'active'
//                         : ''
//                     }
//                     onClick={() => handleFilterToggle(categoryName as keyof DiamondFilters, option)}
//                   >
//                     {option}
//                   </FilterButton>
//                 ))}
//               </Box>
//             )}
//           </Box>
//         ))}
//       </Paper>

//       {/* Active Filters and Search Section */}
//       <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
//         <Grid item xs={12} md={activeFilterChips.length > 0 ? 8 : 12}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search by Shape, Color, or Clarity..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             // InputProps={{
//             //     startAdornment: (
//             //         <SearchIcon color="action" sx={{ mr: 1 }} />
//             //     ),
//             // }}
//             variant="outlined" // ensure the outlined variant
//             slotProps={{
//               input: {
//                 startAdornment: <SearchIcon color="action" style={{ marginRight: 8 }} />,
//               },
//             }}
//           />
//         </Grid>
//         {activeFilterChips.length > 0 && (
//           <Grid
//             item
//             xs={12}
//             md={4}
//             sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', minHeight: 40 }}
//           >
//             {activeFilterChips}
//           </Grid>
//         )}
//       </Grid>

//       {/* Diamond Table */}
//       <TableContainer component={Paper} elevation={3}>
//         <Table>
//           <TableHead sx={{ bgcolor: 'primary.main' }}>
//             <TableRow>
//               <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>ID</TableCell>
//               <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Origin</TableCell>
//               <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Shape</TableCell>
//               <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold' }}>
//                 Carat
//               </TableCell>
//               <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>
//                 Color
//               </TableCell>
//               <TableCell align="center" sx={{ color: 'common.white', fontWeight: 'bold' }}>
//                 Clarity
//               </TableCell>
//               <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold' }}>
//                 Price ($)
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredDiamonds.length > 0 ? (
//               filteredDiamonds.map((diamond) => (
//                 <TableRow key={diamond.id} hover>
//                   <TableCell>{diamond.id}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={diamond.origin}
//                       size="small"
//                       color={diamond.origin === 'Natural' ? 'warning' : 'info'}
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell>{diamond.shape}</TableCell>
//                   <TableCell align="right">{diamond.carat.toFixed(2)}</TableCell>
//                   <TableCell align="center">
//                     {diamond.color.includes('Fancy') ? (
//                       <Chip
//                         label={diamond.color}
//                         size="small"
//                         sx={{
//                           bgcolor: FANCY_COLORS.find((f) => f.key === diamond.color)?.color,
//                           color: 'black',
//                         }}
//                       />
//                     ) : (
//                       diamond.color
//                     )}
//                   </TableCell>
//                   <TableCell align="center">{diamond.clarity}</TableCell>
//                   <TableCell align="right">${diamond.price.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
//                   No diamonds match your current filters and search criteria.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default DiamondFilterList;
