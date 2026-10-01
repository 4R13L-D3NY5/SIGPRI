"""
Motor de Retenciones de Ley SIGPRI - UNITEPC
Módulo de cálculo de impuestos y retenciones tributarias conforme a legislación boliviana (IUE, IT, RC-IVA).
"""

from typing import Dict, Any, Tuple

# Tasas oficiales de retención en Bolivia
TAX_RATES = {
    "COMPRA": 8.0,                       # 5% IUE + 3% IT
    "SERVICIO": 15.5,                    # 12.5% IUE + 3% IT
    "ALQUILER": 16.0,                    # 13% RC-IVA + 3% IT
    "CONSULTORIA": 15.5,                 # 12.5% IUE + 3% IT
    "REMESAS_EXTERIOR": 12.5,            # 12.5% IUE Remesas al Exterior (Acepta retención)
    "REMESAS_EXTERIOR_GROSSUP": 12.5,    # 12.5% IUE Remesas al Exterior con Acrecimiento/Gross-Up (No acepta retención)
    "N/A": 0.0
}

def calculate_retention(
    quantity: float,
    unit_price: float,
    voucher_type: str,
    retention_type: str = "N/A",
    custom_rate: float = None,
    item_type: str = "compra"
) -> Dict[str, Any]:
    """
    Calcula el monto total, retención impositiva y monto ejecutado de un ítem presupuestario.
    Incluye soporte completo para Pagos al Exterior y Gross-Up (Ley 843 Remesas al Exterior 12.5%).
    """
    qty = float(quantity)
    price = float(unit_price)
    raw_total = round(qty * price, 2)
    
    voucher_type_clean = voucher_type.upper().strip() if voucher_type else "FACTURA"
    retention_type_clean = retention_type.upper().strip() if retention_type else "N/A"
    
    if item_type.lower() in ["préstamo", "prestamo"]:
        return {
            "total_amount": raw_total,
            "retention_rate": 0.0,
            "retention_amount": 0.0,
            "executed_amount": raw_total,
            "control_status": "EXENTO_PRESTAMO"
        }

    # CASO ESPECIAL: PAGOS AL EXTERIOR DONDE EL PROVEEDOR NO ACEPTA RETENCIÓN (GROSS-UP 12.5%)
    if retention_type_clean == "REMESAS_EXTERIOR_GROSSUP" or (voucher_type_clean == "FACTURA INTERNACIONAL" and custom_rate == 12.5):
        # El proveedor exige su pago neto exacto = raw_total ($390.00)
        # Se calcula el valor bruto reexpresado = raw_total / (1 - 0.125)
        reexpressed_total = round(raw_total / (1 - 0.125), 2) # e.g. 390 / 0.875 = 445.71
        retention_amount = round(reexpressed_total * 0.125, 2) # e.g. 55.71
        executed_amount = raw_total # e.g. 390.00 exactos para el proveedor
        
        return {
            "total_amount": reexpressed_total,
            "retention_rate": 12.5,
            "retention_amount": retention_amount,
            "executed_amount": executed_amount,
            "control_status": "REMESAS_EXTERIOR_GROSSUP_ASUME_UNITEPC"
        }
        
    if voucher_type_clean == "FACTURA":
        rate = 0.0
        retention_amount = 0.0
        executed_amount = raw_total
        control_status = "FACTURADO_CON_CREDITO_FISCAL"
    elif voucher_type_clean in ["RETENCION", "FACTURA INTERNACIONAL"]:
        if custom_rate is not None and custom_rate >= 0:
            rate = float(custom_rate)
        else:
            rate = TAX_RATES.get(retention_type_clean, 12.5 if voucher_type_clean == "FACTURA INTERNACIONAL" else 8.0)
            
        retention_amount = round(raw_total * (rate / 100.0), 2)
        executed_amount = round(raw_total - retention_amount, 2)
        control_status = f"RETENCION_{retention_type_clean}_{rate}%"
    else:
        rate = 0.0
        retention_amount = 0.0
        executed_amount = raw_total
        control_status = "SIN_RETENCION"

    return {
        "total_amount": raw_total,
        "retention_rate": rate,
        "retention_amount": retention_amount,
        "executed_amount": executed_amount,
        "control_status": control_status
    }
