const fs = require('fs');
const path = require('path');

const apDistrictsData = {
  "Alluri Sitharama Raju": [
    "Addateegala Mandal", "Ananthagiri Mandal", "Araku Valley Mandal", "Chintapalle Mandal",
    "Chintoor Mandal", "Devipatnam Mandal", "Dumbriguda Mandal", "Etaapaka Mandal",
    "G.K.Veedhi Mandal", "G.Madugula Mandal", "Gangavaram Mandal", "Hukumpeta Mandal",
    "Koyyuru Mandal", "Kunavaram Mandal", "Maredumilli Mandal", "Munchingiputtu Mandal",
    "Paderu Mandal", "Pedabayalu Mandal", "Rajavommangi Mandal", "Rampachodavaram Mandal",
    "VR Puram Mandal", "Y.Ramavaram Mandal"
  ],
  "Anakapalli": [
    "Anakapalli Mandal", "Atchutapuram Mandal", "Butchayyapeta Mandal", "Cheedikada Mandal",
    "Chodavaram Mandal", "Devarapalle Mandal", "Golugonda Mandal", "K.Kotapadu Mandal",
    "Kasimkota Mandal", "Kotauratla Mandal", "Madugula Mandal", "Makavarapalem Mandal",
    "Munagapaka Mandal", "Nakkapalle Mandal", "Nathavaram Mandal", "Parawada Mandal",
    "Payakaraopeta Mandal", "Rambilli Mandal", "Ravikamatham Mandal", "Rolugunta Mandal",
    "S.Rayavaram Mandal", "Sabhavaram Mandal", "Yelamanchili Mandal"
  ],
  "Ananthapuramu": [
    "Anantapur Mandal", "Atmakur Mandal", "Beluguppa Mandal", "Bommanahal Mandal",
    "Bukkarayasamudram Mandal", "D.Hirehal Mandal", "Garladinne Mandal", "Gooty Mandal",
    "Gummagatta Mandal", "Guntakal Mandal", "Kanekal Mandal", "Kudair Mandal",
    "Narpala Mandal", "Pamidi Mandal", "Peddavadugur Mandal", "Rapthadu Mandal",
    "Rayadurg Mandal", "Singanamala Mandal", "Tadipatri Mandal", "Uravakonda Mandal",
    "Vajrakarur Mandal", "Vidapanakal Mandal", "Yadiki Mandal", "Yellanur Mandal"
  ],
  "Annamayya": [
    "B.Kothakota Mandal", "Chinnamandem Mandal", "Chitvel Mandal", "Galiveedu Mandal",
    "Gurramkonda Mandal", "K V Palle Mandal", "Kalakada Mandal", "Kurabalakota Mandal",
    "Lakkireddipalli Mandal", "Madanapalle Mandal", "Mulakalacheruvu Mandal", "Nandalur Mandal",
    "Nimmanapalle Mandal", "Obulavaripalli Mandal", "Peddamandyam Mandal", "Penagalur Mandal",
    "Pileru Mandal", "Pullampeta Mandal", "Railway Kodur Mandal", "Rajampet Mandal",
    "Ramapuram Mandal", "Ramasamudram Mandal", "Rayachoti Mandal", "Sambepalli Mandal",
    "Thamballapalle Mandal", "Valamikonda Mandal"
  ],
  "Bapatla": [
    "Addanki Mandal", "Amruthalur Mandal", "Ballikurava Mandal", "Bapatla Mandal",
    "Bhattiprolu Mandal", "Cherukupalle Mandal", "Chinaganjam Mandal", "Inkollu Mandal",
    "Janakavarampanguluru Mandal", "Karamchedu Mandal", "Karlapalem Mandal", "Kollur Mandal",
    "Korisapadu Mandal", "Martur Mandal", "Nagaram Mandal", "Nizampatnam Mandal",
    "Parchur Mandal", "Pittalavanipalem Mandal", "Repalle Mandal", "Santhamaguluru Mandal",
    "Tsundur Mandal", "Vemuru Mandal"
  ],
  "Chittoor": [
    "Bangarupalem Mandal", "Bireddypalli Mandal", "Chittoor Mandal", "Chowdepalle Mandal",
    "Gangadhara Nellore Mandal", "Gangavaram Mandal", "Gudipala Mandal", "Gudupalle Mandal",
    "Irala Mandal", "Karvetinagar Mandal", "Kuppam Mandal", "Nagari Mandal",
    "Nindra Mandal", "Palamaner Mandal", "Peddapanjani Mandal", "Punganur Mandal",
    "Puthalapattu Mandal", "Ramakuppam Mandal", "Shantipuram Mandal", "Somala Mandal",
    "SR Puram Mandal", "Thavanampalle Mandal", "Vadamalapeta Mandal", "Vedurukuppam Mandal",
    "Venkatagirikota Mandal", "Vijayapuram Mandal", "Yadamari Mandal"
  ],
  "East Godavari": [
    "Anaparthi Mandal", "Biccavolu Mandal", "Chagallu Mandal", "Devarapalli Mandal",
    "Gokavaram Mandal", "Gopalapuram Mandal", "Kadiam Mandal", "Korukonda Mandal",
    "Kovvur Mandal", "Nidadavole Mandal", "Nallajerla Mandal", "Peravali Mandal",
    "Rajamahendravaram Rural Mandal", "Rajamahendravaram Urban Mandal", "Rajanagaram Mandal",
    "Seethanagaram Mandal", "Tallapudi Mandal", "Undrajavaram Mandal"
  ],
  "Eluru": [
    "Agiripalli Mandal", "Bhimadole Mandal", "Chatrai Mandal", "Chintalapudi Mandal",
    "Denduluru Mandal", "Dwarka Tirumala Mandal", "Eluru Mandal", "Jangareddigudem Mandal",
    "Jeelugu Milli Mandal", "Kaikaluru Mandal", "Kalidindi Mandal", "Kamavarapukota Mandal",
    "Koyyalagudem Mandal", "Kukunoor Mandal", "Lingapalem Mandal", "Mandavalli Mandal",
    "Mudinepalli Mandal", "Musunuru Mandal", "Nidamarru Mandal", "Nuzvid Mandal",
    "Pedapadu Mandal", "Pedavegi Mandal", "Polavaram Mandal", "T.Narasapuram Mandal",
    "Unguturu Mandal", "Velairpadu Mandal"
  ],
  "Guntur": [
    "Chebrolu Mandal", "Duggirala Mandal", "Guntur East Mandal", "Guntur Rural Mandal",
    "Guntur West Mandal", "Kakumanu Mandal", "Kollipara Mandal", "Mangalagiri Mandal",
    "Medi Konduru Mandal", "Pedakakani Mandal", "Pedakurapadu Mandal", "Ponnur Mandal",
    "Prathipadu Mandal", "Tadepalle Mandal", "Tadikonda Mandal", "Tenali Mandal",
    "Thullur Mandal", "Vatticherukuru Mandal"
  ],
  "Kakinada": [
    "Gollaprolu Mandal", "Gandepalli Mandal", "Jaggampeta Mandal", "Kajuluru Mandal",
    "Kakinada Rural Mandal", "Kakinada Urban Mandal", "Karapa Mandal", "Kirlampudi Mandal",
    "Kotananduru Mandal", "Pedapudi Mandal", "Peddapuram Mandal", "Pithapuram Mandal",
    "Prathipadu Mandal", "Samalkota Mandal", "Sankhavaram Mandal", "Thondangi Mandal",
    "Tuni Mandal", "U.Kothapalli Mandal", "Yeleswaram Mandal"
  ],
  "Konaseema (Dr. B.R. Ambedkar Konaseema)": [
    "Ainavilli Mandal", "Alamuru Mandal", "Allavaram Mandal", "Amalapuram Mandal",
    "Ambajipeta Mandal", "Atreyapuram Mandal", "I.Polavaram Mandal", "K.Gangavaram Mandal",
    "Kapileswarapuram Mandal", "Katrenikona Mandal", "Kothapeta Mandal", "Malikipuram Mandal",
    "Mummidivaram Mandal", "P.Gannavaram Mandal", "Ramachandrapuram Mandal", "Ravulapalem Mandal",
    "Razole Mandal", "Sakhinetipalli Mandal", "Uppalaguptam Mandal"
  ],
  "Kurnool": [
    "Adoni Mandal", "Alur Mandal", "Aspari Mandal", "C.Belagal Mandal",
    "Chippagiri Mandal", "Devanakonda Mandal", "Dhone Mandal", "Emmiganur Mandal",
    "Halaharvi Mandal", "Holagunda Mandal", "Kallur Mandal", "Kodumur Mandal",
    "Kosigi Mandal", "Kowthalam Mandal", "Krishnagiri Mandal", "Kurnool Rural Mandal",
    "Kurnool Urban Mandal", "Maddikera East Mandal", "Mantralayam Mandal", "Nandavaram Mandal",
    "Orvakal Mandal", "Pattikonda Mandal", "Peapully Mandal", "Tuggali Mandal",
    "Veldurthi Mandal"
  ],
  "Nandyal": [
    "Allagadda Mandal", "Atmakur Mandal", "Bandi Atmakur Mandal", "Banaganapalle Mandal",
    "Bethamcherla Mandal", "Chagalamarri Mandal", "Dornipadu Mandal", "Gadivemula Mandal",
    "Gospadu Mandal", "Jupadu Banglow Mandal", "Kolimigundla Mandal", "Kothapalle Mandal",
    "Mahanandi Mandal", "Nandyal Mandal", "Owk Mandal", "Pamulapadu Mandal",
    "Panyam Mandal", "Rudravaram Mandal", "Sanjamala Mandal", "Sirvella Mandal",
    "Srisailam Mandal", "Uyyalawada Mandal", "Velgode Mandal"
  ],
  "NTR (Vijayawada)": [
    "A.Konduru Mandal", "Chandarlapadu Mandal", "G.Konduru Mandal", "Gampalagudem Mandal",
    "Ibrahimpatnam Mandal", "Jaggayyapeta Mandal", "Kanchikacherla Mandal", "Mylavaram Mandal",
    "Nandigama Mandal", "Penuganchiprolu Mandal", "Tiruvuru Mandal", "Vatsavai Mandal",
    "Veerullapadu Mandal", "Vijayawada Central Mandal", "Vijayawada East Mandal",
    "Vijayawada North Mandal", "Vijayawada Rural Mandal", "Vijayawada West Mandal",
    "Vissannapeta Mandal"
  ],
  "Palnadu": [
    "Amaravathi Mandal", "Atchampet Mandal", "Bellamkonda Mandal", "Bollapalle Mandal",
    "Chilakaluripet Mandal", "Dachepalle Mandal", "Edlapadu Mandal", "Gurazala Mandal",
    "Ipur Mandal", "Krosuru Mandal", "Macherla Mandal", "Machavaram Mandal",
    "Muppalla Mandal", "Nadendla Mandal", "Narasaraopet Mandal", "Pedakurapadu Mandal",
    "Piduguralla Mandal", "Rajupalem Mandal", "Rentachintala Mandal", "Rompicherla Mandal",
    "Sattenapalle Mandal", "Savalyapuram Mandal", "Veldurthi Mandal", "Vinukonda Mandal"
  ],
  "Parvathipuram Manyam": [
    "Badangi Mandal", "Balajipeta Mandal", "Bhamini Mandal", "Bobbili Mandal",
    "Garugubilli Mandal", "Gummalaxmipuram Mandal", "Komarada Mandal", "Kurupam Mandal",
    "Makkuva Mandal", "Pachipenta Mandal", "Palakonda Mandal", "Parvathipuram Mandal",
    "Salur Mandal", "Seethampeta Mandal", "Seethanagaram Mandal", "Therlam Mandal",
    "Veeraghattam Mandal"
  ],
  "Prakasam": [
    "Addanki Mandal", "Ardhaveedu Mandal", "Bestavaripeta Mandal", "Chimakurthy Mandal",
    "CS Puram Mandal", "Cumbum Mandal", "Donakonda Mandal", "Dornala Mandal",
    "Giddalur Mandal", "Gudluru Mandal", "Kanigiri Mandal", "Kandukur Mandal",
    "Komarolu Mandal", "Kothapatnam Mandal", "Lingasamudram Mandal", "Maddipadu Mandal",
    "Markapur Mandal", "Marripudi Mandal", "Naguluppalapadu Mandal", "Ongole Mandal",
    "Pamur Mandal", "PC Palli Mandal", "Pedacherlopalle Mandal", "Podili Mandal",
    "Pullalacheruvu Mandal", "Racherla Mandal", "Santhanuthalapadu Mandal", "Singarayakonda Mandal",
    "Tangutur Mandal", "Tripuranthakam Mandal", "Veligandla Mandal", "Voletivaripalem Mandal",
    "Yerragondapalem Mandal", "Zarugumalli Mandal"
  ],
  "Sri Potti Sriramulu Nellore": [
    "Allur Mandal", "Ananthasagaram Mandal", "AS Peta Mandal", "Atmakur Mandal",
    "Bogole Mandal", "Buchireddypalem Mandal", "Chejerla Mandal", "Dagadarthi Mandal",
    "Duttalur Mandal", "Indukurpet Mandal", "Jaladanki Mandal", "Kaligiri Mandal",
    "Kaluvoya Mandal", "Kavali Mandal", "Kodavalur Mandal", "Kovur Mandal",
    "Marripadu Mandal", "Muthukur Mandal", "Nellore Rural Mandal", "Nellore Urban Mandal",
    "Podalakur Mandal", "Rapur Mandal", "Saidapuram Mandal", "Sangam Mandal",
    "Seetharamapuram Mandal", "Thotapalligudur Mandal", "Udayagiri Mandal", "Varikuntapadu Mandal",
    "Venkatachalam Mandal", "Vidavalur Mandal", "Vinjamur Mandal"
  ],
  "Sri Sathya Sai": [
    "Agali Mandal", "Amarapuram Mandal", "Bathalapalle Mandal", "Bukkapatnam Mandal",
    "Chennekothapalli Mandal", "Chilamathur Mandal", "Dharmavaram Mandal", "Gandlapenta Mandal",
    "Gorantla Mandal", "Gudibanda Mandal", "Hindupur Mandal", "Kadiri Mandal",
    "Kanaganapalle Mandal", "Kothacheruvu Mandal", "Lepakshi Mandal", "Madakasira Mandal",
    "Mudigubba Mandal", "Nallacheruvu Mandal", "Nallamada Mandal", "Nambulapulakunta Mandal",
    "O D Cheruvu Mandal", "Penukonda Mandal", "Puttaparthi Mandal", "Ramagiri Mandal",
    "Roddam Mandal", "Rolla Mandal", "Somandepalle Mandal", "Tadimarri Mandal",
    "Talupula Mandal", "Tanakal Mandal"
  ],
  "Srikakulam": [
    "Amadalavalasa Mandal", "Burja Mandal", "Etcherla Mandal", "Gara Mandal",
    "Hiramandalam Mandal", "Ichchapuram Mandal", "Jalumuru Mandal", "Kanchili Mandal",
    "Kaviti Mandal", "Kotabommali Mandal", "Kothuru Mandal", "L.N. Peta Mandal",
    "Laveru Mandal", "Mandasa Mandal", "Meliaputti Mandal", "Nandigam Mandal",
    "Narasannapeta Mandal", "Palasa Mandal", "Pathapatnam Mandal", "Ponduru Mandal",
    "Ranastalam Mandal", "Santhabommali Mandal", "Sarubujjili Mandal", "Sompeta Mandal",
    "Srikakulam Mandal", "Tekkali Mandal", "Vajrapukotturu Mandal"
  ],
  "Tirupati": [
    "Alturpadu Mandal", "Balayapalli Mandal", "Buchinaidu Kandriga Mandal", "Chandragiri Mandal",
    "Chillakur Mandal", "Chittamur Mandal", "Dakkili Mandal", "Doravarisatram Mandal",
    "Gudur Mandal", "K V B Puram Mandal", "Kota Mandal", "Naidupeta Mandal",
    "Ojili Mandal", "Pellakur Mandal", "Ramachandrapuram Mandal", "Renigunta Mandal",
    "Satyavedu Mandal", "Srikalahasti Mandal", "Sullurpeta Mandal", "Tada Mandal",
    "Thottambedu Mandal", "Tirupati Rural Mandal", "Tirupati Urban Mandal", "Vakadu Mandal",
    "Varadaiahpalem Mandal", "Venkatagiri Mandal", "Yerpedu Mandal"
  ],
  "Visakhapatnam": [
    "Anandapuram Mandal", "Bheemunipatnam Mandal", "Gajuwaka Mandal", "Gopalapatnam Mandal",
    "Maharani Peta Mandal", "Mulagada Mandal", "Padmanabham Mandal", "Pedagantyada Mandal",
    "Pendurthi Mandal", "Seethammadhara Mandal", "Visakhapatnam Urban Mandal"
  ],
  "Vizianagaram": [
    "Bondapalli Mandal", "Cheepurupalli Mandal", "Dattirajeru Mandal", "Denkada Mandal",
    "Gajapathinagaram Mandal", "Gantyada Mandal", "Garividi Mandal", "Gurla Mandal",
    "Jami Mandal", "Kothavalasa Mandal", "Lakkavarapukota Mandal", "Mentada Mandal",
    "Merakamudidam Mandal", "Pusapatirega Mandal", "Srungavarapukota Mandal", "Vepada Mandal",
    "Vizianagaram Mandal"
  ],
  "West Godavari": [
    "Achanta Mandal", "Akividu Mandal", "Attili Mandal", "Bhimavaram Mandal",
    "Iragavaram Mandal", "Kalla Mandal", "Mogalthur Mandal", "Narasapuram Mandal",
    "Palacoderu Mandal", "Palacole Mandal", "Pentapadu Mandal", "Poduru Mandal",
    "Tadepalligudem Mandal", "Tanuku Mandal", "Undi Mandal", "Veeravasaram Mandal",
    "Yelamanchili Mandal"
  ],
  "YSR Kadapa": [
    "Atlur Mandal", "B.Kodur Mandal", "Badvel Mandal", "Brahmamgarimattam Mandal",
    "C.K. Dinne Mandal", "Chakrayapet Mandal", "Chapad Mandal", "Chennur Mandal",
    "Chinthakommadinne Mandal", "Duvvur Mandal", "Gopavaram Mandal", "Jammalamadugu Mandal",
    "Kadapa Mandal", "Kalasapadu Mandal", "Kamalapuram Mandal", "Khajipet Mandal",
    "Kondapuram Mandal", "Lingala Mandal", "Muddanur Mandal", "Mydukur Mandal",
    "Mylavaram Mandal", "Peddamudium Mandal", "Pendlimarri Mandal", "Porumamilla Mandal",
    "Proddatur Mandal", "Pulivendula Mandal", "Rajupalem Mandal", "S.Mydukur Mandal",
    "Sidhout Mandal", "Simhadripuram Mandal", "Sri Avadhutha Kasinayana Mandal", "Thondur Mandal",
    "Vallur Mandal", "Veerapunayunipalle Mandal", "Vempalle Mandal", "Vemula Mandal",
    "Vontimitta Mandal", "Yerraguntla Mandal"
  ]
};

const tsDistrictsData = {
  "Adilabad": [
    "Adilabad Urban Mandal", "Adilabad Rural Mandal", "Bazarhathnoor Mandal", "Bela Mandal",
    "Bheempur Mandal", "Boath Mandal", "Gudihathnoor Mandal", "Ichoda Mandal",
    "Jainath Mandal", "Mavala Mandal", "Narnoor Mandal", "Neradigonda Mandal",
    "Sirikonda Mandal", "Tamsi Mandal", "Utnoor Mandal"
  ],
  "Bhadradri Kothagudem": [
    "Allapalli Mandal", "Aswapuram Mandal", "Ashwaraopeta Mandal", "Bhadrachalam Mandal",
    "Burgampahad Mandal", "Chandrugonda Mandal", "Cherla Mandal", "Dammapeta Mandal",
    "Dummugudem Mandal", "Gundala Mandal", "Karakagudem Mandal", "Kothagudem Mandal",
    "Laxmidevipalli Mandal", "Manuguru Mandal", "Mulakalapalle Mandal", "Palwancha Mandal",
    "Pinapaka Mandal", "Sujatanagar Mandal", "Tekulapalli Mandal", "Yellandu Mandal"
  ],
  "Hanamkonda (Warangal Urban)": [
    "Bheemdevarapalle Mandal", "Dharmasagar Mandal", "Elkathurthi Mandal", "Hanamkonda Mandal",
    "Inavolu Mandal", "Kamalapur Mandal", "Kazipet Mandal", "Khazipet Mandal",
    "Velair Mandal"
  ],
  "Hyderabad": [
    "Amberpet Mandal", "Asifnagar Mandal", "Bahadurpura Mandal", "Bandlaguda Mandal",
    "Charminar Mandal", "Golconda Mandal", "Himayathnagar Mandal", "Khairatabad Mandal",
    "Marredpally Mandal", "Musheerabad Mandal", "Nampally Mandal", "Saidabad Mandal",
    "Secunderabad Mandal", "Shaikpet Mandal", "Tirumalagiri Mandal"
  ],
  "Jagtial": [
    "Beerpur Mandal", "Chandurthi Mandal", "Dharmapuri Mandal", "Gollapalli Mandal",
    "Ibrahimpatnam Mandal", "Jagtial Mandal", "Jagtial Rural Mandal", "Kathalapur Mandal",
    "Kodimial Mandal", "Korutla Mandal", "Mallial Mandal", "Mallapur Mandal",
    "Medipalli Mandal", "Metpalli Mandal", "Pegadapalli Mandal", "Raikal Mandal",
    "Sarangapur Mandal", "Velgatoor Mandal"
  ],
  "Jangaon": [
    "Bachannapet Mandal", "Devaruppula Mandal", "Ghanpur Stn Mandal", "Jangaon Mandal",
    "Lingalaghanpur Mandal", "Narmetta Mandal", "Raghunathpalle Mandal", "Tarigoppula Mandal",
    "Zaffergadh Mandal"
  ],
  "Jayashankar Bhupalpally": [
    "Bhupalpally Mandal", "Chityal Mandal", "Ghanpur Mandal", "Kataram Mandal",
    "Koyyuru Mandal", "Mahadevpur Mandal", "Maha Mutharam Mandal", "Malharrao Mandal",
    "Mogullapalle Mandal", "Palimela Mandal", "Tekumatla Mandal"
  ],
  "Jogulamba Gadwal": [
    "Alampur Mandal", "Dharoor Mandal", "Gadwal Mandal", "Gattu Mandal",
    "Itikyal Mandal", "Kaloor Timmanadoddi Mandal", "Leeja Mandal", "Maldakal Mandal",
    "Manopad Mandal", "Rajoli Mandal", "Undavelly Mandal", "Waddepalle Mandal"
  ],
  "Kamareddy": [
    "Bhiknoor Mandal", "Birkoor Mandal", "Domakonda Mandal", "Gandhari Mandal",
    "Jukkal Mandal", "Kamareddy Mandal", "Lingaampet Mandal", "Machareddy Mandal",
    "Madnoor Mandal", "Nagireddipet Mandal", "Nasrullabad Mandal", "Nizam Sagar Mandal",
    "Pitlam Mandal", "Rajampet Mandal", "Sadashivnagar Mandal", "Tadwai Mandal", "Yellareddy Mandal"
  ],
  "Karimnagar": [
    "Choppadandi Mandal", "Elgandal Mandal", "Ganneruvaram Mandal", "Huzurabad Mandal",
    "Jammikunta Mandal", "Karimnagar Mandal", "Karimnagar Rural Mandal", "Kothapalli Mandal",
    "Manakondur Mandal", "Ramadugu Mandal", "Shankarapatnam Mandal", "Thimmapur Mandal",
    "Veenavanka Mandal"
  ],
  "Khammam": [
    "Bonakal Mandal", "Chintakani Mandal", "Enkoor Mandal", "Kalluru Mandal",
    "Khammam Urban Mandal", "Khammam Rural Mandal", "Konijerla Mandal", "Kusumanchi Mandal",
    "Madira Mandal", "Mudigonda Mandal", "Nelakondapalli Mandal", "Penuballi Mandal",
    "Raghunadhapalem Mandal", "Sathupalli Mandal", "Singareni Mandal", "Thirumalayapalem Mandal",
    "Vemsoor Mandal"
  ],
  "Kumuram Bheem Asifabad": [
    "Asifabad Mandal", "Bejjur Mandal", "Chintalamanepally Mandal", "Dahegaon Mandal",
    "Jainoor Mandal", "Kagaznagar Mandal", "Kerameri Mandal", "Lingapur Mandal",
    "Penchikalpet Mandal", "Rebbena Mandal", "Sirpur T Mandal", "Sirpur U Mandal",
    "Tiryani Mandal", "Wadapally Mandal"
  ],
  "Mahabubabad": [
    "Bayyaram Mandal", "Dornakal Mandal", "Garla Mandal", "Gudur Mandal",
    "Kesamudram Mandal", "Kuravi Mandal", "Mahabubabad Mandal", "Maripeda Mandal",
    "Nellikudur Mandal", "Narsimhulapet Mandal", "Thorrur Mandal"
  ],
  "Mahabubnagar": [
    "Addakal Mandal", "Balanagar Mandal", "Bhoothpur Mandal", "C C Kunta Mandal",
    "Devarkadra Mandal", "Gandeed Mandal", "Jadcherla Mandal", "Koilkonda Mandal",
    "Mahabubnagar Urban Mandal", "Mahabubnagar Rural Mandal", "Midjil Mandal", "Moosapet Mandal",
    "Nawabpet Mandal", "Rajoli Mandal"
  ],
  "Mancherial": [
    "Bheemaram Mandal", "Chennur Mandal", "Dandepally Mandal", "Hajipur Mandal",
    "Jaipur Mandal", "Jannaram Mandal", "Kotapally Mandal", "Luxettipet Mandal",
    "Mancherial Mandal", "Mandamarri Mandal", "Naspur Mandal", "Nennal Mandal",
    "Vemanpally Mandal"
  ],
  "Medak": [
    "Alladurg Mandal", "Chegunta Mandal", "Havelighanpur Mandal", "Kowdipally Mandal",
    "Kulcharam Mandal", "Medak Mandal", "Manoharabad Mandal", "Narsingi Mandal",
    "Narsapur Mandal", "Nizampet Mandal", "Papannapet Mandal", "Ramayampet Mandal",
    "Regode Mandal", "Shankarampet A Mandal", "Shankarampet R Mandal", "Tekmal Mandal",
    "Yeldurthy Mandal"
  ],
  "Medchal-Malkajgiri": [
    "Alwal Mandal", "Balanagar Mandal", "Gandimaisamma Mandal", "Ghatkesar Mandal",
    "Keesara Mandal", "Kukatpally Mandal", "Malkajgiri Mandal", "Medchal Mandal",
    "Medipally Mandal", "Muduchintalapalli Mandal", "Quthbullapur Mandal", "Shamirpet Mandal",
    "Uppal Mandal"
  ],
  "Mulugu": [
    "Eturnagaram Mandal", "Govindaraopet Mandal", "Kannaigudem Mandal", "Mangapet Mandal",
    "Mulugu Mandal", "SS Tadvai Mandal", "Venkatapur Mandal", "Wazeedu Mandal"
  ],
  "Nagarkurnool": [
    "Bijinapalle Mandal", "Charakonda Mandal", "Kodeer Mandal", "Kollapur Mandal",
    "Lingal Mandal", "Nagarkurnool Mandal", "Padara Mandal", "Pentlavelly Mandal",
    "Tadoor Mandal", "Telkapalle Mandal", "Thimmajipeta Mandal", "Veldanda Mandal"
  ],
  "Nalgonda": [
    "Adavidevulapally Mandal", "Anumula Haliya Mandal", "Chandur Mandal", "Chityal Mandal",
    "Dameracherla Mandal", "Devarakonda Mandal", "Gundlapally Mandal", "Kangal Mandal",
    "Kattangoor Mandal", "Kethepally Mandal", "Marriguda Mandal", "Miryalaguda Mandal",
    "Munugode Mandal", "Nakrekal Mandal", "Nalgonda Mandal", "Narketpally Mandal",
    "Neredugommu Mandal", "Nidamanoor Mandal", "Peddavoora Mandal", "Saligouraram Mandal",
    "Tipparthi Mandal", "Tripuraram Mandal"
  ],
  "Narayanpet": [
    "Damaragidda Mandal", "Dhanwada Mandal", "Kosgi Mandal", "Krishna Mandal",
    "Maddur Mandal", "Makthal Mandal", "Marikal Mandal", "Narayanpet Mandal",
    "Narwa Mandal", "Utkoor Mandal"
  ],
  "Nirmal": [
    "Basar Mandal", "Bhainsa Mandal", "Dilawarpur Mandal", "Kaddam Mandal",
    "Khanapur Mandal", "Kubeer Mandal", "Lokeshwaram Mandal", "Mamda Mandal",
    "Mudhole Mandal", "Narsapur G Mandal", "Nirmal Urban Mandal", "Nirmal Rural Mandal",
    "Pembi Mandal", "Sarangapur Mandal", "Sontala Mandal"
  ],
  "Nizamabad": [
    "Armoor Mandal", "Balkonda Mandal", "Bheemgal Mandal", "Bodhan Mandal",
    "Chandur Mandal", "Dharpally Mandal", "Dichpally Mandal", "Indalwai Mandal",
    "Jakranpally Mandal", "Kammarpally Mandal", "Kotagiri Mandal", "Makloor Mandal",
    "Mortal Mandal", "Nizamabad Urban Mandal", "Nizamabad Rural Mandal", "Renjal Mandal",
    "Sirikonda Mandal", "Varni Mandal", "Velpur Mandal", "Yedapally Mandal"
  ],
  "Peddapalli": [
    "Anthergoan Mandal", "Dharmaram Mandal", "Eligaid Mandal", "Julapalli Mandal",
    "Kamanpur Mandal", "Manthani Mandal", "Mutharam Mandal", "Odela Mandal",
    "Peddapalli Mandal", "Ramagundam Mandal", "Srirampur Mandal", "Sulthanabad Mandal"
  ],
  "Rajanna Sircilla": [
    "Boinpalli Mandal", "Chandurthi Mandal", "Gambhiraopet Mandal", "Illanthakunta Mandal",
    "Konaraopet Mandal", "Mustabad Mandal", "Rudrangi Mandal", "Sircilla Mandal",
    "Thangallapalli Mandal", "Veenavanka Mandal", "Veernapalli Mandal", "Yellareddypet Mandal"
  ],
  "Ranga Reddy": [
    "Abdullapurmet Mandal", "Balapur Mandal", "Chevella Mandal", "Farooqnagar Mandal",
    "Hayathnagar Mandal", "Ibrahimpatnam Mandal", "Jandiguda Mandal", "Kandukur Mandal",
    "Keshampet Mandal", "Kondurg Mandal", "Kothur Mandal", "Maheshwaram Mandal",
    "Manchal Mandal", "Moinabad Mandal", "Nandigama Mandal", "Rajendranagar Mandal",
    "Saroornagar Mandal", "Shadnagar Mandal", "Shamirpet Mandal", "Shabad Mandal",
    "Shamshabad Mandal", "Yacharam Mandal"
  ],
  "Sangareddy": [
    "Ameenpur Mandal", "Andole Mandal", "Gummadidala Mandal", "Hathnoora Mandal",
    "Jharasangam Mandal", "Kandi Mandal", "Kangti Mandal", "Kohir Mandal",
    "Kondapur Mandal", "Manoor Mandal", "Mogudampally Mandal", "Munipally Mandal",
    "Narayankhed Mandal", "Narayankhed Rural Mandal", "Patancheru Mandal", "Pulkal Mandal",
    "Raikode Mandal", "Sadasivpet Mandal", "Sangareddy Mandal", "Sirgapur Mandal",
    "Vatpally Mandal", "Zaheerabad Mandal"
  ],
  "Siddipet": [
    "Bejjanki Mandal", "Cherial Mandal", "Chinnakodur Mandal", "Dhoolmitta Mandal",
    "Gajwel Mandal", "Husnabad Mandal", "Jagdevpur Mandal", "Jangoan Mandal",
    "Komuravelli Mandal", "Kondapak Mandal", "Markook Mandal", "Mirdoddi Mandal",
    "Mulug Mandal", "Nangnoor Mandal", "Narayanraopet Mandal", "Raipole Mandal",
    "Siddipet Urban Mandal", "Siddipet Rural Mandal", "Thoguta Mandal", "Wargal Mandal"
  ],
  "Suryapet": [
    "Ananthagiri Mandal", "Atmakur S Mandal", "Chivemla Mandal", "Garidepally Mandal",
    "Huzurnagar Mandal", "Jajireddygudem Mandal", "Kodad Mandal", "Maddirala Mandal",
    "Mattampally Mandal", "Mellachervu Mandal", "Mothey Mandal", "Munagala Mandal",
    "Nadigudem Mandal", "Nereducherla Mandal", "Noothankal Mandal", "Penpahad Mandal",
    "Phanigiri Mandal", "Suryapet Mandal", "Thirumalagiri Mandal"
  ],
  "Vikarabad": [
    "Bantwaram Mandal", "Basheerabad Mandal", "Chincholi Mandal", "Dharur Mandal",
    "Doma Mandal", "Doulthabad Mandal", "Kodangal Mandal", "Kotepally Mandal",
    "Kulkacherla Mandal", "Marpalle Mandal", "Mominpet Mandal", "Nawabpet Mandal",
    "Pargi Mandal", "Pudur Mandal", "Tandur Mandal", "Vikarabad Mandal", "Yalal Mandal"
  ],
  "Wanaparthy": [
    "Amarchinta Mandal", "Atmakur Mandal", "Chinnambavi Mandal", "Ghanpur Mandal",
    "Gopalpeta Mandal", "Kothakota Mandal", "Madanapur Mandal", "Pangal Mandal",
    "Pebbair Mandal", "Revally Mandal", "Srirangapur Mandal", "Veepangandla Mandal",
    "Wanaparthy Mandal"
  ],
  "Warangal": [
    "Chennaraopet Mandal", "Duggondi Mandal", "Geesugonda Mandal", "Khanapur Mandal",
    "Narsampet Mandal", "Nekkonda Mandal", "Narsimhulapet Mandal", "Parvathagiri Mandal",
    "Rayaparthy Mandal", "Sangem Mandal", "Wardhannapet Mandal"
  ],
  "Yadadri Bhuvanagiri": [
    "Addagudur Mandal", "Alair Mandal", "Atmakur M Mandal", "Bhudhan Pochampally Mandal",
    "Bhongir Mandal", "Choutuppal Mandal", "Mothkur Mandal", "Gundala Mandal",
    "Ramannapet Mandal", "Rajapet Mandal", "Turkapally Mandal", "Valigonda Mandal",
    "Yadagirigutta Mandal"
  ]
};

// Load existing states data
const statesDataPath = path.join(__dirname, 'statesData.js');
let code = fs.readFileSync(statesDataPath, 'utf8');

// Extract object dynamically
const match = code.match(/export const STATES_DATA = (\{[\s\S]*\});/);
if (!match) {
  console.error('Failed to parse STATES_DATA from statesData.js');
  process.exit(1);
}

const statesData = eval('(' + match[1] + ')');

// Re-assign updated AP and TS data
statesData["Andhra Pradesh"] = apDistrictsData;
statesData["Telangana"] = tsDistrictsData;

// Clean up and deduplicate mandals for all states
for (const state in statesData) {
  const sortedDistricts = {};
  const districtKeys = Object.keys(statesData[state]).sort();

  for (const dist of districtKeys) {
    const rawList = statesData[state][dist];
    if (Array.isArray(rawList)) {
      const cleanSet = new Set();
      rawList.forEach((item) => {
        if (item && typeof item === 'string') {
          let clean = item.trim().replace(/\s+/g, ' ');
          if (clean) cleanSet.add(clean);
        }
      });
      sortedDistricts[dist] = Array.from(cleanSet).sort();
    }
  }
  statesData[state] = sortedDistricts;
}

// Generate formatted JS file content
const outputJs = `export const STATES_DATA = ${JSON.stringify(statesData, null, 2)};\n`;
fs.writeFileSync(statesDataPath, outputJs, 'utf8');
console.log('Successfully updated statesData.js with latest 26 Andhra Pradesh districts and 33 Telangana districts!');
