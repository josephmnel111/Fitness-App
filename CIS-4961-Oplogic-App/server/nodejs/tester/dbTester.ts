import * as mysql from 'mysql2';
import { FieldPacket, OkPacket, ResultSetHeader } from 'mysql2';
import {
    Channel,
    User,
    Membership,
    Message,
    Audit,
    Events,
    Settings,
    Customer,
} from '../../../shared/models/Model';
import { SQL } from '../modules/sqlHelper';

const pool = mysql
    .createPool({
        host: 'localhost',
        user: 'root',
        password: 'test',
        database: 'oplogicdb',
        port: 3306,
        namedPlaceholders: true,
    })
    .promise();

pool.execute(SQL.getChannelsByUserId, [1]).then((r) => {
    console.log('Get user channels');
    console.log(r[0]);
});

pool.query(SQL.getAllUsers).then((r) => {
    console.log('Get all users');
    console.log(r[0]);
});

let channel = new Channel({
    isPrivate: true,
    isDirectMessage: false,
    name: 'Test Channel',
    description: '',
});

pool.execute(SQL.createChannel, channel).then((r) => {
    console.log('Create test channel results:');
    console.log((r[0] as ResultSetHeader));
});
