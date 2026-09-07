// Comprehensive UP Location Hierarchy for KisanSetu Land & Property Details
// District -> Tehsil -> Village mapping adhering to official UP Revenue records

export interface UpDistrictHierarchy {
  district: string;
  tehsils: {
    tehsil: string;
    villages: string[];
  }[];
}

export const UP_LOCATIONS: UpDistrictHierarchy[] = [
  {
    district: 'Bareilly',
    tehsils: [
      {
        tehsil: 'Baheri',
        villages: ['Haridaspur', 'Shergarh', 'Richha', 'Damkhoda', 'Jamuniyan', 'Mundia', 'Uttarsi', 'Rithora Dehat'],
      },
      {
        tehsil: 'Meerganj',
        villages: ['Fatehganj Paschimi', 'Shahi', 'Mirganj Dehat', 'Sindhauli', 'Churaha', 'Dhunka'],
      },
      {
        tehsil: 'Aonla',
        villages: ['Ramnagar', 'Majhgawan', 'Sirauli', 'Aliganj', 'Bisharatganj', 'Manpur'],
      },
      {
        tehsil: 'Faridpur',
        villages: ['Faridpur Dehat', 'Fatehganj Purvi', 'Bhamora', 'Pipra', 'Rafiabad', 'Govindpur'],
      },
      {
        tehsil: 'Nawabganj',
        villages: ['Hafizganj', 'Senthal', 'Bijamau', 'Rithora', 'Barkhan', 'Dalpatpur'],
      },
      {
        tehsil: 'Bareilly Sadar',
        villages: ['Cantonment Area', 'Rithora Dehat', 'Maheshpur', 'Dohna', 'C.B. Ganj Dehat', 'Parsakhera'],
      },
    ],
  },
  {
    district: 'Meerut',
    tehsils: [
      {
        tehsil: 'Mawana',
        villages: ['Asilpur', 'Hastinapur', 'Kithore', 'Phalat', 'Bahsuma', 'Rahawati'],
      },
      {
        tehsil: 'Sardhana',
        villages: ['Daurala', 'Lawar', 'Karnawal', 'Pohalli', 'Khera', 'Salawa'],
      },
      {
        tehsil: 'Meerut Sadar',
        villages: ['Mohiuddinpur', 'Jani Khurd', 'Rohta', 'Partapur Dehat', 'Dabathwa', 'Shorab'],
      },
    ],
  },
  {
    district: 'Varanasi',
    tehsils: [
      {
        tehsil: 'Pindra',
        villages: ['Karampur', 'Phulpur', 'Mangari', 'Babatpur', 'Kharagpur', 'Sindhora'],
      },
      {
        tehsil: 'Varanasi Sadar',
        villages: ['Shivpur Dehat', 'Kashi Vidyapeeth', 'Lohta', 'Sarnath Dehat', 'Harhua', 'Chiraigaon'],
      },
      {
        tehsil: 'Rajatalab',
        villages: ['Rohaniya', 'Mirzamurad', 'Jakhini', 'Araziline', 'Kachnar', 'Raja Talab Dehat'],
      },
    ],
  },
  {
    district: 'Rampur',
    tehsils: [
      {
        tehsil: 'Suar',
        villages: ['Aglaga', 'Dhanpuri', 'Maswasi', 'Tanda', 'Akbarabad', 'Bhainsia'],
      },
      {
        tehsil: 'Bilaspur',
        villages: ['Kemri', 'Rudrapur Border', 'Manpur', 'Siras Khera', 'Dhimri'],
      },
      {
        tehsil: 'Milak',
        villages: ['Dhamora', 'Patwai', 'Shahabad Road', 'Karimganj', 'Loha'],
      },
      {
        tehsil: 'Rampur Sadar',
        villages: ['Civil Lines Dehat', 'Saifni', 'Chamraua', 'Panwaria', 'Bhot'],
      },
    ],
  },
  {
    district: 'Moradabad',
    tehsils: [
      {
        tehsil: 'Kanth',
        villages: ['Chhajlet', 'Umri', 'Sahaspur', 'Madhan', 'Patti Mod'],
      },
      {
        tehsil: 'Bilari',
        villages: ['Kundarki', 'Seondara', 'Deorania', 'Ibrahimpur', 'Thakurdwara Border'],
      },
      {
        tehsil: 'Moradabad Sadar',
        villages: ['Pakbara', 'Mundha Pande', 'Bhojpur', 'Dharmpur', 'Dalpatpur Dehat'],
      },
      {
        tehsil: 'Thakurdwara',
        villages: ['Dilari', 'Surjan Nagar', 'Pasia Para', 'Karnapur'],
      },
    ],
  },
  {
    district: 'Bulandshahr',
    tehsils: [
      {
        tehsil: 'Anupshahr',
        villages: ['Jahangirabad', 'Ahar', 'Karanpur', 'Malakpur', 'Baroli'],
      },
      {
        tehsil: 'Siana',
        villages: ['Bugrasi', 'Bhawan Bahadur Nagar', 'Chingrawathi', 'Bavri'],
      },
      {
        tehsil: 'Khurja',
        villages: ['Arnia', 'Danpur', 'Pahasu', 'Dharpa', 'Jahangirpur'],
      },
      {
        tehsil: 'Bulandshahr Sadar',
        villages: ['Gulaothi', 'Shikarpur', 'Kakore', 'Chhatari', 'Bhatona'],
      },
    ],
  },
  {
    district: 'Lucknow',
    tehsils: [
      {
        tehsil: 'Bakshi Ka Talab',
        villages: ['Itaunja', 'Mahona', 'Kathwara', 'Asthona', 'Bhaisamau'],
      },
      {
        tehsil: 'Mohanlalganj',
        villages: ['Gosainganj', 'Nagram', 'Amethi', 'Samesi', 'Sisendi'],
      },
      {
        tehsil: 'Malihabad',
        villages: ['Rahimabad', 'Kakori', 'Saspan', 'Bakhtiyarnagar', 'Kasmandi Kalan'],
      },
      {
        tehsil: 'Lucknow Sadar',
        villages: ['Chinhat Dehat', 'Sarojini Nagar Dehat', 'Bijnor Dehat', 'Gauri'],
      },
    ],
  },
  {
    district: 'Gorakhpur',
    tehsils: [
      {
        tehsil: 'Sahjanwa',
        villages: ['Ghaghrara', 'Piprauli', 'Rithia', 'Bhariwaisi', 'Hasanpur'],
      },
      {
        tehsil: 'Campierganj',
        villages: ['Peppeganj', 'Machhligao', 'Rawatganj', 'Bharwaliya', 'Bardiha'],
      },
      {
        tehsil: 'Bansgaon',
        villages: ['Uruwa', 'Gagaha', 'Belghat', 'Khajni Dehat', 'Koilari'],
      },
      {
        tehsil: 'Gorakhpur Sadar',
        villages: ['Bhathat', 'Chargawan', 'Khorabar', 'Jungle Kauria', 'Pipraich Dehat'],
      },
    ],
  },
  {
    district: 'Aligarh',
    tehsils: [
      {
        tehsil: 'Atrauli',
        villages: ['Bijouli', 'Gangiri', 'Chharra', 'Barla', 'Sankra'],
      },
      {
        tehsil: 'Khair',
        villages: ['Tappal', 'Chandaus', 'Pisawa', 'Gomat', 'Andla'],
      },
      {
        tehsil: 'Iglas',
        villages: ['Gonda', 'Beswan', 'Hasayan', 'Gorai', 'Bijauli'],
      },
      {
        tehsil: 'Koil',
        villages: ['Dhanipur', 'Lodha', 'Jawan Sikandarpur', 'Harduaganj', 'Sasni Gate Dehat'],
      },
    ],
  },
  {
    district: 'Badaun',
    tehsils: [
      {
        tehsil: 'Bilsi',
        villages: ['Islamnagar', 'Sahaswan Road', 'Rudayan', 'Ujhani Border', 'Behta'],
      },
      {
        tehsil: 'Bisauli',
        villages: ['Asafpur', 'Madhkar', 'Saidpur', 'Dabhori', 'Karanpur'],
      },
      {
        tehsil: 'Badaun Sadar',
        villages: ['Ujhani', 'Salarpur', 'Binawar', 'Kakrala', 'Alapur'],
      },
      {
        tehsil: 'Dataganj',
        villages: ['Saman', 'Usawan', 'Miaon', 'Bela', 'Dundwara Border'],
      },
      {
        tehsil: 'Sahaswan',
        villages: ['Dahgawan', 'Kachhla', 'Zarifnagar', 'Nadrai'],
      },
    ],
  },
  {
    district: 'Agra',
    tehsils: [
      {
        tehsil: 'Fatehabad',
        villages: ['Shamsabad', 'Dhimshri', 'Piparani', 'Iradatnagar'],
      },
      {
        tehsil: 'Kheragarh',
        villages: ['Saiyan', 'Jagner', 'Basoni', 'Sarendhi'],
      },
      {
        tehsil: 'Bah',
        villages: ['Pinahat', 'Jaitpur Kalan', 'Bateshwar', 'Kachhpura'],
      },
      {
        tehsil: 'Etmadpur',
        villages: ['Khandauli', 'Barhan', 'Semra', 'Gadhipur'],
      },
      {
        tehsil: 'Agra Sadar',
        villages: ['Bichpuri', 'Achhnera Dehat', 'Akola', 'Midhakur'],
      },
    ],
  },
  {
    district: 'Prayagraj',
    tehsils: [
      {
        tehsil: 'Phulpur',
        villages: ['Bahadurpur', 'Sahson', 'Mubarakpur', 'Koraon Border', 'Harpur'],
      },
      {
        tehsil: 'Soraon',
        villages: ['Holagarh', 'Mauaima', 'Dahiyawan', 'Mandhata Border'],
      },
      {
        tehsil: 'Karchhana',
        villages: ['Chaka', 'Naini Dehat', 'Kaundhiyara', 'Ghurpur'],
      },
      {
        tehsil: 'Handia',
        villages: ['Dhanupur', 'Saidabad', 'Pratappur', 'Bypass Khurd'],
      },
    ],
  },
  {
    district: 'Kanpur Nagar',
    tehsils: [
      {
        tehsil: 'Bilhaur',
        villages: ['Araul', 'Kakwan', 'Chaubepur', 'Shivrajpur'],
      },
      {
        tehsil: 'Ghatampur',
        villages: ['Patara', 'Bhitargaon', 'Sadh', 'Reuna'],
      },
      {
        tehsil: 'Kanpur Sadar',
        villages: ['Kalyanpur Dehat', 'Bidhnu', 'Sarsaul', 'Maharajpur'],
      },
    ],
  },
  {
    district: 'Ayodhya',
    tehsils: [
      {
        tehsil: 'Sohawal',
        villages: ['Raunahi', 'Masodha', 'Deokali', 'Salempur'],
      },
      {
        tehsil: 'Rudauli',
        villages: ['Bhelsar', 'Mawai', 'Khandpipra', 'Basorhi'],
      },
      {
        tehsil: 'Milkipur',
        villages: ['Amaniganj', 'Harringtonganj', 'Kuchela', 'Piroor'],
      },
      {
        tehsil: 'Bikapur',
        villages: ['Tarun', 'Chaure Bazar', 'Bhadarsa', 'Nandigram'],
      },
    ],
  },
  {
    district: 'Pilibhit',
    tehsils: [
      {
        tehsil: 'Bisalpur',
        villages: ['Barkhera', 'Bilsanda', 'Deorania Border', 'Amrita'],
      },
      {
        tehsil: 'Puranpur',
        villages: ['Madhotanda', 'Sherpur Kalan', 'Dhanara', 'Jadopur'],
      },
      {
        tehsil: 'Pilibhit Sadar',
        villages: ['Jahanabad', 'Lalpur', 'Marori', 'Kalyanpur'],
      },
    ],
  },
  {
    district: 'Shahjahanpur',
    tehsils: [
      {
        tehsil: 'Tilhar',
        villages: ['Nigohi', 'Jaitipur', 'Katra', 'Khudaganj'],
      },
      {
        tehsil: 'Powayan',
        villages: ['Banda', 'Khutar', 'Sindhauli Dehat', 'Nahil'],
      },
      {
        tehsil: 'Jalalabad',
        villages: ['Mirzapur', 'Kalan', 'Allahganj', 'Gungchhai'],
      },
      {
        tehsil: 'Shahjahanpur Sadar',
        villages: ['Bhawal Khera', 'Kanth Dehat', 'Dadraul', 'Rauza Dehat'],
      },
    ],
  },
];

/**
 * Get all supported UP Districts
 */
export function getUpDistricts(): string[] {
  return UP_LOCATIONS.map((d) => d.district);
}

/**
 * Get Tehsils strictly dependent on the selected District
 */
export function getUpTehsils(district: string): string[] {
  if (!district) return [];
  const found = UP_LOCATIONS.find((d) => d.district.toLowerCase() === district.trim().toLowerCase());
  return found ? found.tehsils.map((t) => t.tehsil) : [];
}

/**
 * Get Villages strictly dependent on the selected Tehsil & District
 */
export function getUpVillages(district: string, tehsil: string): string[] {
  if (!district || !tehsil) return [];
  const foundDistrict = UP_LOCATIONS.find((d) => d.district.toLowerCase() === district.trim().toLowerCase());
  if (!foundDistrict) return [];

  const foundTehsil = foundDistrict.tehsils.find((t) => t.tehsil.toLowerCase() === tehsil.trim().toLowerCase());
  return foundTehsil ? foundTehsil.villages : [];
}
