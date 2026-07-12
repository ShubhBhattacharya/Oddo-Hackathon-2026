from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import time

app = Flask(__name__)
CORS(app)
DB_FILE = 'transitops.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Vehicles Table
    cursor.execute('''CREATE TABLE IF NOT EXISTS vehicles (
        reg TEXT PRIMARY KEY, model TEXT, type TEXT, region TEXT, odo INTEGER, status TEXT)''')
    
    # Drivers Table
    cursor.execute('''CREATE TABLE IF NOT EXISTS drivers (
        license TEXT PRIMARY KEY, name TEXT, contact TEXT, expiry TEXT, score INTEGER, status TEXT)''')
    
    # Trips Table
    cursor.execute('''CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT, dest TEXT, vehicle TEXT, driver TEXT, dist INTEGER, stage TEXT)''')
    
    # Alerts Table
    cursor.execute('''CREATE TABLE IF NOT EXISTS driver_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, driver_lic TEXT, message TEXT, timestamp TEXT, status TEXT)''')

    # Seed initial optimization data if tables are empty
    cursor.execute("SELECT COUNT(*) FROM drivers")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO drivers VALUES ('DL-14202600123', 'Alex Kumar', '+91 98765 43210', '2028-12-12', 94, 'Available')")
        cursor.execute("INSERT INTO drivers VALUES ('DL-16202400987', 'Rahul Sharma', '+91 87654 32109', '2026-05-10', 78, 'On Trip')")
        cursor.execute("INSERT INTO drivers VALUES ('349056', 'Rohan', '4568090223', '2026-07-21', 100, 'Available')")
        
        cursor.execute("INSERT INTO vehicles VALUES ('DL-01-M-5555', 'Tata Ace Gold', 'Mini Truck', 'North', 12400, 'Available')")
        cursor.execute("INSERT INTO vehicles VALUES ('MH-02-EE-1234', 'Mahindra Blazo', 'Heavy Truck', 'West', 45000, 'On Trip')")
        
        cursor.execute("INSERT INTO trips (source, dest, vehicle, driver, dist, stage) VALUES ('Delhi', 'Mumbai', 'MH-02-EE-1234', 'Rahul Sharma', 1400, 'Dispatched')")
        
        cursor.execute("INSERT INTO driver_alerts (driver_lic, message, timestamp, status) VALUES ('DL-14202600123', 'Optimization Engine Active.', '10:14 AM', 'Sent')")
        
    conn.commit()
    conn.close()

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    c.execute("SELECT * FROM vehicles")
    vehicles = [{"reg": r[0], "model": r[1], "type": r[2], "region": r[3], "odo": r[4], "status": r[5]} for r in c.fetchall()]
    
    c.execute("SELECT * FROM drivers")
    drivers = [{"license": r[0], "name": r[1], "contact": r[2], "expiry": r[3], "score": r[4], "status": r[5]} for r in c.fetchall()]
    
    c.execute("SELECT * FROM trips")
    trips = [{"id": r[0], "source": r[1], "dest": r[2], "vehicle": r[3], "driver": r[4], "dist": r[5], "stage": r[6]} for r in c.fetchall()]
    
    c.execute("SELECT * FROM driver_alerts ORDER BY id DESC")
    alerts = [{"id": r[0], "driver_lic": r[1], "message": r[2], "timestamp": r[3], "status": r[4]} for r in c.fetchall()]
    
    conn.close()
    return jsonify({"vehicles": vehicles, "drivers": drivers, "trips": trips, "alerts": alerts})

@app.route('/api/driver/contact', methods=['POST'])
def contact_driver():
    data = request.json
    timestamp = time.strftime("%I:%M %p")
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO driver_alerts (driver_lic, message, timestamp, status) VALUES (?, ?, ?, 'Sent')", 
                  (data['driver_lic'], data['message'], timestamp))
        conn.commit()
        res = {"status": "success", "message": "Alert logged dynamically!"}
    except Exception as e:
        res = {"status": "error", "message": str(e)}
    conn.close()
    return jsonify(res)

if __name__ == '__main__':
    init_db()
    app.run(port=5000, debug=True)