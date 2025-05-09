import React from 'react'
import NavStyle from '@/widgets/layout/nav_style';
import ExchangeRateTable from '@/widgets/exchangeRateTable';
import ExchangeRateGraph from '@/widgets/ExchangeRateGraph';
import TelegramNavbar from '@/widgets/layout/telegramNavbar';

function ViewExchangeRates() {
  return (
      <div className=' min-h-screen'>
          <TelegramNavbar />
          <div className='pt-7  '>
              <div className=''>
                  <ExchangeRateTable/>
        </div>
        
        <div className='lg:mx-24 mx-1'>
          <ExchangeRateGraph/>
        </div>
          </div>
    </div>
  )
}

export default ViewExchangeRates