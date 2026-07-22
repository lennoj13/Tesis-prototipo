#Validar los datos enviados en el formulario
import re

def has_only_digits(value):
    return value is not None and str(value).strip() and bool(re.fullmatch(r'\d+', str(value).strip()))

def has_only_letters(value):
    return value is not None and str(value).strip() and bool(re.fullmatch(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+", str(value).strip()))

def add_field_error(field_errors, field_name, value, validator, message):
    if value is not None and str(value).strip() and not validator(value):
        field_errors[field_name] = message