import { createBeneficiaryService, createTransferService } from "../services/cashfree.js";

export const createBeneficiary = async (req, res) => {
  try {
    const response = await createBeneficiaryService({
      beneficiary_id: req.body.beneficiaryId,
      beneficiary_name: req.body.name,
      beneficiary_instrument_details: {
        bank_account_number: req.body.bankAccount,
        bank_ifsc: req.body.ifsc,
        vpa: req.body.vpa,
      },
      beneficiary_contact_details: {
        beneficiary_email: req.body.email,
        beneficiary_phone: req.body.phone,
        beneficiary_country_code: req.body.countryCode,
        beneficiary_address: req.body.address,
        beneficiary_city: req.body.city,
        beneficiary_state: req.body.state,
        beneficiary_postal_code: req.body.postalCode,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Beneficiary creation failed" });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const response = await createTransferService({
      transfer_id: "TR_" + Date.now(),
      transfer_amount: req.body.amount,
      beneficiary_details: {
        beneficiary_id: req.body.beneficiaryId,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Transfer failed" });
  }
};
