export const validateCreateOrder = (req, res, next) => {
    const { orderAmount, customerId, customerPhone } = req.body;

    if (!orderAmount || !customerId || !customerPhone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (orderAmount <= 0) {
        return res.status(400).json({ error: "Invalid order amount" });
    }

    next();
};

export const validateBeneficiary = (req, res, next) => {
    const { beneficiaryId, name, bankAccount, ifsc } = req.body;

    if (!beneficiaryId || !name || !bankAccount || !ifsc) {
        return res.status(400).json({ error: "Missing beneficiary details" });
    }

    next();
};

export const validateTransfer = (req, res, next) => {
    const { beneficiaryId, amount } = req.body;

    if (!beneficiaryId || !amount) {
        return res.status(400).json({ error: "Missing transfer details" });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: "Invalid transfer amount" });
    }

    next();
};