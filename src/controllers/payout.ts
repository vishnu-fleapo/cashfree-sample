import { Request, Response } from "express";
import { createBeneficiaryService, createTransferService } from "../services";
import { CreateBeneficiaryBody, CreateTransferBody } from "@/types";

export const createBeneficiary = async (
  req: Request<{}, {}, CreateBeneficiaryBody>,
  res: Response,
): Promise<Response> => {
  try {
    const {
      beneficiaryId,
      name,
      bankAccount,
      ifsc,
      vpa,
      email,
      phone,
      countryCode,
      address,
      city,
      state,
      postalCode,
    } = req.body;

    const response = await createBeneficiaryService({
      beneficiary_id: beneficiaryId,
      beneficiary_name: name,
      beneficiary_instrument_details: {
        bank_account_number: bankAccount,
        bank_ifsc: ifsc,
        vpa,
      },
      beneficiary_contact_details: {
        beneficiary_email: email,
        beneficiary_phone: phone,
        beneficiary_country_code: countryCode,
        beneficiary_address: address,
        beneficiary_city: city,
        beneficiary_state: state,
        beneficiary_postal_code: postalCode,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Beneficiary creation failed" });
  }
};

export const createTransfer = async (
  req: Request<{}, {}, CreateTransferBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { beneficiaryId, amount } = req.body;

    const response = await createTransferService({
      transfer_id: `TR_${Date.now()}`,
      transfer_amount: amount,
      beneficiary_details: {
        beneficiary_id: beneficiaryId,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Transfer failed" });
  }
};
