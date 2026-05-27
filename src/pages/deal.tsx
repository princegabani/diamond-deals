import { CONFIG } from 'src/config-global';

import { DealView } from 'src/sections/deal/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Deal - ${CONFIG.appName}`}</title>

      <DealView />
    </>
  );
}
