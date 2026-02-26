import { Request, response, Response } from "express";
import {
  createBeneficiaryService,
  createCreatorBeneficiary,
  createPayout,
  createTransferService,
  getCreatorPendingPayoutAmount,
  getLatestBeneficary,
  getPayoutDetails,
  getPayoutRequestsService,
  updatePayout,
  updateSubscriptions,
} from "../services";
import {
  CreateBeneficiaryBody,
  CreateTransferBody,
  Payout,
  PayoutTransferStatus,
  TransferMode,
} from "@/types";
import { generateUUID } from "@/utils";

export const createBeneficiary = async (
  req: Request<{}, {}, CreateBeneficiaryBody>,
  res: Response,
): Promise<Response> => {
  try {
    const {
      customerId,
      name,
      bankAccount,
      ifsc,
      email,
      phone,
      countryCode,
      address,
      city,
      state,
      postalCode,
    } = req.body;

    const beneficiary_id = generateUUID("BENE");

    const { data } = await createBeneficiaryService({
      beneficiary_id,
      beneficiary_name: name,
      beneficiary_instrument_details: {
        bank_account_number: bankAccount,
        bank_ifsc: ifsc,
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

    const cashfreeBeneficiary = await createCreatorBeneficiary({
      beneficiary_id,
      user_id: customerId,
    });

    return res.json(cashfreeBeneficiary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Beneficiary creation failed" });
  }
};

export const createTransfer = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  try {
    const { id: payoutId } = req.params;

    console.log(payoutId);

    let payout = await getPayoutDetails(payoutId);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    if (payout.status !== PayoutTransferStatus.WAITING_FOR_APPROVAL)
      return res.status(400).json({ message: "Invald payout" });

    const transfer_id = generateUUID("PAYOUT");
    const response = await createTransferService({
      transfer_id,
      transfer_amount: payout.amount,
      beneficiary_details: {
        beneficiary_id: payout.beneficiary_id,
      },
      transfer_mode: TransferMode.NEFT,
    });

    console.log(response.data);

    if (!response.data.transfer_id)
      return res.status(400).json({ message: "Failed to transfer" });

    const { status, added_on } = response.data;

    const updatedPayout = await updatePayout(<Payout>{
      id: payoutId,
      reference_id: transfer_id,
      approved_at: added_on,
      status,
    });

    return res.json(updatedPayout);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Transfer failed" });
  }
};

export const requestPayout = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
) => {
  const { id: userId } = req.params;
  console.log(req.params);
  if (!userId) return res.status(400).json({ message: "No user found" });

  const data = await getCreatorPendingPayoutAmount(userId);

  const totalAmount =
    data?.reduce((sum, row) => {
      if (row.payments?.status !== "SUCCESS") return sum;
      return sum + Number(row.payments?.amount ?? 0);
    }, 0) ?? 0;

  console.log(totalAmount);

  const subscriptionIds = data?.map((row) => row.id) ?? [];

  if (totalAmount <= 0)
    return res.status(400).json({ message: "Nothing to redeeem" });

  const userBenefifcary = await getLatestBeneficary(userId);
  if (!userBenefifcary)
    return res.status(400).json({ message: "Add a beneficiary account" });

  const payout = await createPayout(<Payout>{
    amount: totalAmount,
    beneficiary_id: userBenefifcary.beneficiary_id,
    user_id: userId,
    status: PayoutTransferStatus.WAITING_FOR_APPROVAL,
  });

  await updateSubscriptions({ subscriptionIds, payout_id: payout.id });
  return res.json(payout);
};

export const getPayoutRequests = async (
  req: Request<{}, {}, {}, { status?: PayoutTransferStatus }>,
  res: Response,
) => {
  try {
    const { status } = req.query;

    const payouts = await getPayoutRequestsService(status);

    return res.status(200).json(payouts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch payouts" });
  }
};
