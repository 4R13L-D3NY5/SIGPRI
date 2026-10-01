import unittest
from app.tax_engine import calculate_retention, TAX_RATES

class TestTaxEngine(unittest.TestCase):

    def test_factura_retention(self):
        # Factura debe tener 0% retención
        res = calculate_retention(quantity=5, unit_price=100, voucher_type="FACTURA", retention_type="COMPRA")
        self.assertEqual(res["total_amount"], 500.0)
        self.assertEqual(res["retention_rate"], 0.0)
        self.assertEqual(res["retention_amount"], 0.0)
        self.assertEqual(res["executed_amount"], 500.0)
        self.assertIn("FACTURADO", res["control_status"])

    def test_retencion_compra(self):
        # Compra retención en Bolivia = 8% (5% IUE + 3% IT)
        res = calculate_retention(quantity=10, unit_price=200, voucher_type="RETENCION", retention_type="COMPRA")
        self.assertEqual(res["total_amount"], 2000.0)
        self.assertEqual(res["retention_rate"], 8.0)
        self.assertEqual(res["retention_amount"], 160.0) # 2000 * 0.08
        self.assertEqual(res["executed_amount"], 1840.0) # 2000 - 160

    def test_retencion_servicio(self):
        # Servicio retención en Bolivia = 15.5% (12.5% IUE + 3% IT)
        res = calculate_retention(quantity=1, unit_price=4000, voucher_type="RETENCION", retention_type="SERVICIO")
        self.assertEqual(res["total_amount"], 4000.0)
        self.assertEqual(res["retention_rate"], 15.5)
        self.assertEqual(res["retention_amount"], 620.0) # 4000 * 0.155
        self.assertEqual(res["executed_amount"], 3380.0) # 4000 - 620

    def test_retencion_alquiler(self):
        # Alquiler retención en Bolivia = 16% (13% RC-IVA + 3% IT)
        res = calculate_retention(quantity=1, unit_price=1000, voucher_type="RETENCION", retention_type="ALQUILER")
        self.assertEqual(res["total_amount"], 1000.0)
        self.assertEqual(res["retention_rate"], 16.0)
        self.assertEqual(res["retention_amount"], 160.0)
        self.assertEqual(res["executed_amount"], 840.0)

    def test_prestamo_item(self):
        # Préstamo exento o retención 0
        res = calculate_retention(quantity=25, unit_price=80, voucher_type="N/A", retention_type="N/A", item_type="prestamo")
        self.assertEqual(res["total_amount"], 2000.0)
        self.assertEqual(res["retention_rate"], 0.0)
        self.assertEqual(res["retention_amount"], 0.0)
        self.assertEqual(res["executed_amount"], 2000.0)
        self.assertEqual(res["control_status"], "EXENTO_PRESTAMO")

    def test_remesas_exterior_grossup(self):
        # Pago al exterior donde el proveedor exige 390.00 exactos netos (No acepta retención -> Gross-Up 12.5%)
        # Monto Bruto Reexpresado = 390 / 0.875 = 445.71
        # Retención 12.5% = 55.71
        # Ejecutado al Proveedor = 390.00
        res = calculate_retention(quantity=10, unit_price=39, voucher_type="FACTURA INTERNACIONAL", retention_type="REMESAS_EXTERIOR_GROSSUP")
        self.assertEqual(res["total_amount"], 445.71)
        self.assertEqual(res["retention_rate"], 12.5)
        self.assertEqual(res["retention_amount"], 55.71)
        self.assertEqual(res["executed_amount"], 390.0)

    def test_remesas_exterior_acepta_retencion(self):
        # Pago al exterior donde el proveedor SÍ acepta retención directa (12.5%)
        # Monto Facturado = 390.00, Retención 12.5% = 48.75, Ejecutado = 341.25
        res = calculate_retention(quantity=10, unit_price=39, voucher_type="FACTURA INTERNACIONAL", retention_type="REMESAS_EXTERIOR")
        self.assertEqual(res["total_amount"], 390.0)
        self.assertEqual(res["retention_rate"], 12.5)
        self.assertEqual(res["retention_amount"], 48.75)
        self.assertEqual(res["executed_amount"], 341.25)

if __name__ == "__main__":
    unittest.main()
