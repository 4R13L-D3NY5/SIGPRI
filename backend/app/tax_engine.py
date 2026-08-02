"""
Motor de Retenciones de Ley SIGPRI - UNITEPC
Módulo de cálculo de impuestos y retenciones tributarias conforme a legislación boliviana (IUE, IT, RC-IVA).
"""

from typing import Dict, Any, Tuple

# Tasas oficiales de retención en Bolivia
TAX_RATES = {
    "COMPRA": 8.0,       # 5% IUE + 3% IT
    "SERVICIO": 15.5,    # 12.5% IUE + 3% IT
    "ALQUILER": 16.0,    # 13% RC-IVA + 3% IT
    "CONSULTORIA": 15.5, # 12.5% IUE + 3% IT
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
    
    Args:
        quantity: Cantidad de unidades.
        unit_price: Precio unitario.
        voucher_type: 'FACTURA', 'RETENCION' o 'N/A'
        retention_type: 'COMPRA', 'SERVICIO', 'ALQUILER', 'CONSULTORIA' o 'N/A'
        custom_rate: Porcentaje de retención explícito (opcional)
        item_type: 'compra', 'prestamo', 'servicio'
        
    Returns:
        Dict con total_amount, retention_rate, retention_amount, executed_amount, control_status
    """
    total_amount = round(float(quantity) * float(unit_price), 2)
    
    voucher_type_clean = voucher_type.upper().strip() if voucher_type else "FACTURA"
    retention_type_clean = retention_type.upper().strip() if retention_type else "N/A"
    
    if item_type.lower() == "préstamo" or item_type.lower() == "prestamo":
        # Préstamos institucionales no representan desembolso monetario ejecutable directamente
        return {
            "total_amount": total_amount,
            "retention_rate": 0.0,
            "retention_amount": 0.0,
            "executed_amount": total_amount,
            "control_status": "EXENTO_PRESTAMO"
        }
        
    if voucher_type_clean == "FACTURA":
        rate = 0.0
        retention_amount = 0.0
        executed_amount = total_amount
        control_status = "FACTURADO_CON_CREDITO_FISCAL"
    elif voucher_type_clean == "RETENCION":
        if custom_rate is not None and custom_rate >= 0:
            rate = float(custom_rate)
        else:
            rate = TAX_RATES.get(retention_type_clean, 8.0)
            
        retention_amount = round(total_amount * (rate / 100.0), 2)
        executed_amount = round(total_amount - retention_amount, 2)
        control_status = f"RETENCION_{retention_type_clean}_{rate}%"
    else:
        # N/A o sin retención
        rate = 0.0
        retention_amount = 0.0
        executed_amount = total_amount
        control_status = "SIN_RETENCION"

    return {
        "total_amount": total_amount,
        "retention_rate": rate,
        "retention_amount": retention_amount,
        "executed_amount": executed_amount,
        "control_status": control_status
    }
