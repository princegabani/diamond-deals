import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Collapse, Table, TableBody, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  certiNumber: string;
  shape: string;
  carat: number;
  price: number;
  remark: string;
  status: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

// export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
//   const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

//   const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
//     setOpenPopover(event.currentTarget);
//   }, []);

//   const handleClosePopover = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//   return (
//     <>
//       <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
//         <TableCell padding="checkbox">
//           <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
//         </TableCell>

//         {/* <TableCell component="th" scope="row">
//           <Box
//             sx={{
//               gap: 2,
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             <Avatar alt={row.name} src={row.avatarUrl} />
//             {row.name}
//           </Box>
//         </TableCell> */}

//         <TableCell>{row.certiNumber}</TableCell>
//         <TableCell>{row.shape}</TableCell>

//         <TableCell>{row.carat}</TableCell>
//         <TableCell>{row.price}</TableCell>
//         <TableCell>{row.remark}</TableCell>

//         <TableCell align="center">
//           {row.status ? (
//             <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
//           ) : (
//             '-'
//           )}
//         </TableCell>

//         <TableCell>
//           <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
//         </TableCell>

//         <TableCell align="right">
//           <IconButton onClick={handleOpenPopover}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       <Popover
//         open={!!openPopover}
//         anchorEl={openPopover}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuList
//           disablePadding
//           sx={{
//             p: 0.5,
//             gap: 0.5,
//             width: 140,
//             display: 'flex',
//             flexDirection: 'column',
//             [`& .${menuItemClasses.root}`]: {
//               px: 1,
//               gap: 2,
//               borderRadius: 0.75,
//               [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
//             },
//           }}
//         >
//           <MenuItem onClick={handleClosePopover}>
//             <Iconify icon="solar:pen-bold" />
//             Edit
//           </MenuItem>

//           <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
//             <Iconify icon="solar:trash-bin-trash-bold" />
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Popover>
//     </>
//   );
// }

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      {/* MAIN ROW */}
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        {/* EXPAND ICON */}
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </TableCell>

        <TableCell>{row.certiNumber}</TableCell>
        <TableCell>{row.shape}</TableCell>
        <TableCell>{row.carat}</TableCell>
        <TableCell>{row.price}</TableCell>
        <TableCell>{row.remark}</TableCell>

        <TableCell>
          <Label color={row.status === 'available' ? 'success' : 'warning'}>{row.status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* COLLAPSIBLE CONTENT */}
      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Diamond Details
              </Typography>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Certificate No</TableCell>
                    <TableCell>{row.certiNumber}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Shape</TableCell>
                    <TableCell>{row.shape}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Carat</TableCell>
                    <TableCell>{row.carat} ct</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>${row.price}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Remark</TableCell>
                    <TableCell>{row.remark}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* ACTION POPOVER */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            width: 140,
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
