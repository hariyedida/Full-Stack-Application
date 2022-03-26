const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const { response } = require("express");
const dbPath = path.join(__dirname, "associate_management_db.db");

const app = express();
app.use(express.json());
app.use(cors());

let db = null;
let port;

const initializeDbAndServer = async () => {
	try {
		db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});
		port = process.env.PORT || 9000;
		app.listen(port, () =>
			console.log(`server Running at http://localhost:${port}/`)
		);
	} catch (error) {
		console.log(`DB Error: ${error.message}`);
		process.exit(1);
	}
};

initializeDbAndServer();

app.get("/", (req, res) => {
	res.status(200);
	res.send("Running");
});

app.get("/users", async (req, res) => {
	const { search } = req.query;
	console.log(search);
	let data = null;
	const dataQuery = `SELECT * FROM associates_master NATURAL JOIN specialization_master WHERE associate_name LIKE '%${search}%'`;
	data = await db.all(dataQuery);
	res.status(200);
	res.json({ userData: data });
});

app.get("/user-details/:id", async (req, res) => {
	const { id } = req.params;
	let userData = null;
	try {
		const dataQuery = `SELECT * FROM associates_master NATURAL JOIN specialization_master WHERE associate_id=${id}`;
		userData = await db.all(dataQuery);
	} catch (error) {
		console.log(error);
	}
	if (userData.length > 0) {
		res.status(200);
		res.json({ userData });
	} else {
		res.status(204);
	}
});

app.post("/add-user", async (req, res) => {
	const { userData } = req.body;
	const { specialization_name, associate_name, phone, address } = userData;
	const specialization_master_Query = `INSERT INTO specialization_master (specialization_name) VALUES ('${specialization_name}');`;
	const specialization_master_res = await db.run(specialization_master_Query);
	const { lastID } = specialization_master_res;
	const associates_master_query = `INSERT INTO associates_master (associate_name, phone, address, specialization_id) VALUES('${associate_name}','${phone}',' ${address}', '${lastID}' );`;
	const associates_master_res = await db.run(associates_master_query);
	res.json({ associates_master_res });
});

app.put("/update-user/:id", async (req, res) => {
	const { id } = req.params;
	const { userData } = req.body;
	console.log(id, userData);
	const {
		specialization_name,
		associate_name,
		phone,
		address,
		specialization_id,
	} = userData;
	const associates_master_Query = `UPDATE associates_master SET associate_name='${associate_name}',phone =${phone}, address='${address}',specialization_id=${specialization_id} WHERE associate_id=${id} ;`;
	const specialization_master_Query = `UPDATE specialization_master SET specialization_name ='${specialization_name}' WHERE specialization_id=${specialization_id} ;`;
	const associates_master_res = await db.run(associates_master_Query);
	const specialization_master_res = await db.run(specialization_master_Query);
	console.log(associates_master_res);
	res.send(200);
});

app.delete("/delete-user", async (req, res) => {
	const { deleteIds } = req.body;
	const str = deleteIds.join(",");
	const deleteQuery = `DELETE FROM specialization_master WHERE specialization_id IN (${str})`;
	await db.run(deleteQuery);
	res.send(200);
	console.log(deleteQuery);
});
