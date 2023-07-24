from jose import jwt
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta

def validate_token(token, secret_key, audience=None, issuer=None):
    try:
        payload = jwt.decode(token)
        header = jwt.get_unverified_header(token)
        jwt.decode(token, secret_key, algorithms=[header['alg']])
        exp = payload.get('exp')
        if exp is not None and datetime.utcnow() > datetime.utcfromtimestamp(exp):
            raise jwt.ExpiredSignatureError('Token has expired')
        return payload

    except jwt.PyJWTError as e:
       return JSONResponse(status_code=500,content={"detail": "Invalid Token"})