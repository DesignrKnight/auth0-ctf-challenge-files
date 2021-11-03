from jwcrypto import jwk, jwt  # pip install jwcrypto
import json

with open("keypair.pem", "rb") as pemfile:
    key = jwk.JWK.from_pem(pemfile.read())
publicKey = key.export(private_key=False)

jwks = {}
jwks["keys"] = [json.loads(publicKey)]

with open("jwks.json", "w") as jwksfile:
    json.dump(jwks, jwksfile)

# eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImprdSI6Imh0dHA6Ly9sb2NhbGhvc3QvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiM2Y1ZDkyOTAtMTVmNy00NWE5LTlkN2MtZjY4MGUyNjk0ZTcwIn0.eyJ1c2VybmFtZSI6InVzZXIiLCJpYXQiOjE2MzQ4MzQxNDcsImV4cCI6MTYzNDg1NTc0N30.RiKDUZ4dqdAP3Fh2eaYUSenPwiG0NqXvzhJy4Fn2y-gkXp8vGxomwYKtKJYW8UV_XH5RfAcAaPeVPwZwuTJ2vGr4ZOe5PT0vttV3AC2LFREIsRQdARELtbOa_VC0GDV4cM8YjKTgC7kCtHTKvzVr3BIpUoL3hIGsrAE3kc_efA-wwBX5Q3-WyY3lLFPJg84g9baBnrgUQ5Tf1ycV_1bz8SBaTYZFiIkaHs1ApLutSx3_53L0Gt6N-UtBdy7NxLzGqBLe67GpbWBkjNKGkvvUyN_SzKOwVVvsjgSb6VA066UpljPugZiYjDNXWMnkzbPOShNPvonpdkQlNsf-nwaVoQ
token = jwt.JWT(
    header={
        "alg": "RS256",
        "typ": "JWT",
        "jku": "https://curly-art-0176.designrknight.workers.dev/jwks.json",
        "kid": key.key_id,
    },
    claims={"username": "admin", "iat": 1634834147, "exp": 9634855747},
)

token.make_signed_token(key)
print(token.serialize())
