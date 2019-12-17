import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const tasks_status = [
            {
                id: 1, taskID: 1, subjectName: 'TEST1', subjectMode: 'download', lastStatus: 'OK',
                lastDataStatus: '2017.09.05 12:28', nextScheduledDate: '2017.09.06 12:28',
                scheduledInterval: '08:30 pt STY', scheduledIsActive: true
            },
            {
                id: 2, taskID: 2,  subjectName: 'TEST2', subjectMode: 'download', lastStatus: 'Error',
                lastDataStatus: '2017.09.04 16:28', nextScheduledDate: '2017.09.05 16:28',
                scheduledInterval: '08:* pn,sr STY,LUT', scheduledIsActive: false
            },
            {
                id: 3, taskID: 3,  subjectName: 'TEST3', subjectMode: 'download', lastStatus: 'Running',
                lastDataStatus: '2017.09.04 17:28', nextScheduledDate: '2017.09.05 17:28',
                scheduledInterval: '*:*/15 pn,wt,sr,cz,pt,so,nd STY,LUT,MAR,KWI,MAJ,CZE,LIP,SIE,WRZ,PAŹ,LIS,GRU', scheduledIsActive: false
            }
        ];
        const taskConfig = [
            {
                id: 1, taskStatusID: 1, subjectName: 'TEST1', subjectAddress: '192.168.1.1', subjectLogin: 'external_user_1', subjectPassword: '',
                subjectDirectory: '/sftp/ftp/',
                subjectExchangeProtocol: 'sftp',
                subjectPrivateKey: 'id_rsa_1',
                subjectMode: 'download', subjectLoginForm: '', subjectLogoutForm: '', subjectPostOptions: '',
                subjectResponseString: '',
                servers: [
                             {serverAddress: '192.168.2.1', serverLogin: 'domena_AD/user1', serverPassword: 'blabla1', serverDirectory: '/Workspace1/'},
                             {serverAddress: '192.168.2.2', serverLogin: 'domena_AD/user2', serverPassword: 'blabla2', serverDirectory: '/Workspace2/'},
                             {serverAddress: '192.168.2.3', serverLogin: 'domena_AD/user3', serverPassword: 'blabla3', serverDirectory: '/Workspace3/'}
                ],
                serverSourceFileMode: '', serverDecompressionMethod: '',
                serverDecryptionMethod: '', serverDecryptionKey: '',
                dateFormat: 'ddMMyyyy',
                fileList: [{fileName: '*<data>*.zip'}
                ],
                fileArchive: true,
                minutes: '30',
                hours: '8',
                days: 96,
                mounths: 16,
                mailFrom: 'fes@mailex.com',
                mailSubject: 'Raport z pobierania plikow od TEST1',
                mailingList: [
                              {recipientName: 'user1@mailex.com'}
                ]
             },
             {
                 id: 2, taskStatusID: 2, subjectName: 'TEST2', subjectAddress: '192.168.1.2', subjectLogin: 'external_user_2',
                 subjectPassword: 'blabla1',
                 subjectDirectory: 'https://test.com/',
                 subjectExchangeProtocol: 'ssl', subjectPrivateKey: '',
                 subjectMode: 'download', subjectLoginForm: '/data/login.cgi?realm=j4bn_users&username=$Login&password=$Haslo',
                 subjectLogoutForm: '/data/auth/logout.cgi', subjectPostOptions: '',
                 subjectResponseString: '',
                 servers: [
                              {serverAddress: '192.168.2.1', serverLogin: 'domena_AD/user1', serverPassword: 'blabla1', serverDirectory: '/Workspace/'}
                 ],
                 serverSourceFileMode: '', serverDecompressionMethod: 'gzip',
                 serverDecryptionMethod: '', serverDecryptionKey: '',
                 dateFormat: 'yyyyMMdd',
                 fileList: [{fileName: 'TEST1_<data>_00?.xml.gz'},
                            {fileName: 'TEST2_<data>_00?.xml.gz'},
                            {fileName: 'TEST3_<data>_00?.xml.gz'},
                            {fileName: 'TEST4_<data>_00?.xml.gz'}
                 ],
                 fileArchive: false,
                 minutes: '*',
                 hours: '8',
                 days: 5,
                 mounths: 5,
                 mailFrom: 'fes@mailex.com',
                 mailSubject: 'Raport z pobierania plikow od TEST2',
                 mailingList: [
                               {recipientName: 'user1@mailex.com'},
                               {recipientName: 'user2@mailex.com'}
                 ]
              },
               {
                   id: 3, taskStatusID: 3, subjectName: 'TEST3', subjectAddress: 'h192.168.1.3', subjectLogin: 'external_user_3',
                   subjectPassword: 'blabla',
                   subjectDirectory: 'https://test.com/,DataInfo=com_sd&task=getfile&file=',
                   subjectExchangeProtocol: 'ssl', subjectPrivateKey: 'id_rsa_2',
                   subjectMode: 'upload', subjectLoginForm: '/data/auth/login.cgi?realm=j4bn_users&username=$Login&password=$Haslo',
                   subjectLogoutForm: '/data/auth/logout.cgi', subjectPostOptions: 'option=com_sd,task=upload,ufile=@',
                   subjectResponseString: 'uploaded',
                   servers: [
                                {serverAddress: '192.168.2.1', serverLogin: 'domena_AD/user1', serverPassword: 'blabla1', serverDirectory: '/Workspace/'}
                   ],
                   serverSourceFileMode: '', serverDecompressionMethod: '',
                   serverDecryptionMethod: '', serverDecryptionKey: '',
                   dateFormat: 'yyyyMMdd',
                   fileList: [{fileName: 'TEST2_<data>_00?.xml.gz'},
                                {fileName: 'TEST2_<data>_00?.xml.gz'},
                                {fileName: 'TEST3_<data>_00?.xml.gz'},
                   ],
                   fileArchive: false,
                   minutes: '*',
                   hours: '8',
                   days: 5,
                   mounths: 5,
                   mailFrom: 'fes@mailex.com',
                   mailSubject: 'Raport z pobierania plikow od TEST3',
                   mailingList: [
                                 {recipientName: 'user1@mailex.com'},
                                 {recipientName: 'user2@mailex.com'}
                   ]
                },
             ];
            const server = [
                {
                    privateKeys: [
                          { privateKeyName: 'id_rsa_1'},
                          { privateKeyName: 'id_rsa_2'},
                  ],
                  publicKeys: [
                              { publicKeyName: 'id_rsa_pub1'},
                              { publicKeyName: 'id_rsa_pub2'},
                      ],
                },
             ];
            const addFileExchange = [
                {
                    id: 1000,
                    taskID: 2,
                    fileDate: '10122019',
                    fileList: [{fileName: 'TEST1_<data>_00?.xml.gz'},
                               {fileName: 'TEST2_<data>_00?.xml.gz'},
                               {fileName: 'TEST3_<data>_00?.xml.gz'}
                    ],
                },
            ];
            const fileExchangeStatus = [
                {
                    id: 1000,
                    taskID: 2,
                    eventDate: '15122019',
                    eventLog: [{sequenceNumber: '1', eventText: '24 Oct 2017 16:00:01,987 [main] INFO  Main  - Start logowania zdarzeń'},
                               {sequenceNumber: '2', eventText: '24 Oct 2017 16:00:02,089 [main] INFO  Main  - Wymiana danych z podmiotem...'},
                               {sequenceNumber: '3', eventText: '24 Oct 2017 16:00:02,089 [main] INFO  Main  - Kasuje pliki w katalogu /work_directory/input/...'},
                               {sequenceNumber: '4', eventText: '24 Oct 2017 16:00:02,090 [main] INFO  Main  - Pliki skasowane'},
                               {sequenceNumber: '5', eventText: '24 Oct 2017 16:00:02,094 [main] INFO  ProtocolSFTP  - Inicjalizacja połączenia....'},
                               {sequenceNumber: '6', eventText: '24 Oct 2017 16:00:02,094 [main] INFO  ProtocolSFTP  - Private key file: /work_directory/id_rsa_1'},
                               {sequenceNumber: '7', eventText: '24 Oct 2017 16:00:03,661 [main] INFO  ProtocolSFTP  - Trwa łączenie do 192.168.1.2'},
                               {sequenceNumber: '8', eventText: '24 Oct 2017 16:00:03,813 [main] INFO  ProtocolSFTP  - Klucz serwera (ssh-rsa):'}
                   ],
                },
                {
                    id: 1001,
                    taskID: 1,
                    eventDate: '16122019',
                    eventLog: [{sequenceNumber: '1', eventText: '24 Oct 2017 16:00:01,987 [main] INFO  Main  - Start logowania zdarzeń'},
                               {sequenceNumber: '2', eventText: '24 Oct 2017 16:00:02,089 [main] INFO  Main  - Wymiana danych z podmiotem...'},
                               {sequenceNumber: '3', eventText: '24 Oct 2017 16:00:02,089 [main] INFO  Main  - Kasuje pliki w katalogu /work_directory/input/...'},
                               {sequenceNumber: '4', eventText: '24 Oct 2017 16:00:02,090 [main] INFO  Main  - Pliki skasowane'},
                               {sequenceNumber: '5', eventText: '24 Oct 2017 16:00:02,094 [main] INFO  ProtocolSFTP  - Inicjalizacja połączenia....'},
                               {sequenceNumber: '6', eventText: '24 Oct 2017 16:00:02,094 [main] INFO  ProtocolSFTP  - Private key file: /work_directory/id_rsa_1'},
                               {sequenceNumber: '7', eventText: '24 Oct 2017 16:00:03,661 [main] INFO  ProtocolSFTP  - Trwa łączenie do 192.168.1.2'},
                               {sequenceNumber: '8', eventText: '24 Oct 2017 16:00:03,813 [main] INFO  ProtocolSFTP  - Klucz serwera (ssh-rsa):'}
                   ],
                },
            ];
            return { tasks_status, taskConfig, server, addFileExchange, fileExchangeStatus };
    }
}
