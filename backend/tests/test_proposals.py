import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestProposals(unittest.TestCase):

    def setUp(self):
        Base.metadata.create_all(bind=engine)

    def tearDown(self):
        Base.metadata.drop_all(bind=engine)

    def test_create_and_get_proposal(self):
        payload = {
            "title": "Sistema de Telemedicina UNITEPC",
            "area": "Ciencias de la Salud",
            "gestora": "Dra. Maria Lorena Orellana Aguilar",
            "summary": "Proyecto de prueba para telemedicina",
            "team_members": [
                {
                    "name": "Dr. Juan Pérez",
                    "ci": "1234567",
                    "carrera": "MEDICINA",
                    "institucion": "UNITEPC",
                    "profesion": "DOCENTE"
                }
            ]
        }
        response = client.post("/api/proposals/", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["title"], "Sistema de Telemedicina UNITEPC")
        self.assertIn("SIGPRI-2026-", data["code"])
        self.assertTrue(len(data["wbs_tasks"]) > 0)
        self.assertTrue(len(data["budget_items"]) > 0)

        proposal_id = data["id"]
        get_res = client.get(f"/api/proposals/{proposal_id}")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["code"], data["code"])

    def test_calculate_tax_endpoint(self):
        payload = {
            "quantity": 4,
            "unit_price": 500,
            "voucher_type": "RETENCION",
            "retention_type": "SERVICIO"
        }
        response = client.post("/api/budget/calculate", json=payload)
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertEqual(res["total_amount"], 2000.0)
        self.assertEqual(res["retention_rate"], 15.5)
        self.assertEqual(res["retention_amount"], 310.0)
        self.assertEqual(res["executed_amount"], 1690.0)

if __name__ == "__main__":
    unittest.main()
