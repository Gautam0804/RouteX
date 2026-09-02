const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/customer.controller");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// All customer routes require a valid login token
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL CUSTOMERS
// GET /api/customers
// =====================================================

router.get("/", getCustomers);

// =====================================================
// GET CUSTOMER BY ID
// GET /api/customers/:id
// =====================================================

router.get("/:id", getCustomerById);

// =====================================================
// CREATE CUSTOMER
// POST /api/customers
// =====================================================

router.post("/", createCustomer);

// =====================================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// =====================================================

router.put("/:id", updateCustomer);

// =====================================================
// DEACTIVATE CUSTOMER
// DELETE /api/customers/:id
// =====================================================

router.delete("/:id", deleteCustomer);

module.exports = router;