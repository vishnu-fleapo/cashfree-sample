1. Should convert sandbox to production for live payments
2. The BASE URL changes from https://sandbox.cashfree.com to https://api.cashfree.com
3. The Auth is not there as this is POC setup and also when converting we'll be using the normal guards & all
4. The IP needs to be whitelisted for any scenarios & for localhost add the IP in https://merchant.cashfree.com/payouts/developers/2fa
5. Get your IP using `curl ifconfig.me`
