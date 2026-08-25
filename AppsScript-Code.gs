/**
 * ============================================================
 * KODE INI DITEMPEL DI GOOGLE APPS SCRIPT (script.google.com)
 * BUKAN di website. Lihat PANDUAN-SETUP.md untuk langkah lengkap.
 * ============================================================
 *
 * Fungsinya: menjembatani Google Sheets (sebagai database) dengan
 * website X TJKT 1, supaya 5 admin di komputer berbeda bisa baca
 * & tulis data yang sama secara real-time.
 */

// ID Google Sheet kamu (ambil dari URL sheet, di antara /d/ dan /edit)
const SHEET_ID = 'TEMPEL_ID_SHEET_DI_SINI';

// ID folder Google Drive tempat nyimpen foto galeri (ambil dari URL folder,
// di antara /folders/ dan akhir URL). Lihat PANDUAN-SETUP.md.
const DRIVE_FOLDER_ID = 'TEMPEL_ID_FOLDER_DRIVE_DI_SINI';

// Hash SHA-256 dari sandi admin. Default sandinya: admintjkt1
// (Sama dengan sandi admin.html — kalau ganti salah satu, ganti juga yang satunya)
const ADMIN_HASH = '352df6859167c1a00391a23fc6d535ea4561cd560ca263b976f30548528af074';

// ================= ENTRY POINTS =================

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = {
    siswa: readSiswa(ss),
    jadwal: readJadwal(ss),
    piket: readPiket(ss),
    kas: readKas(ss),
    galeri: readGaleri(ss)
  };
  return jsonOut(data);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ success: false, message: 'Data tidak valid.' });
  }

  if (sha256Hex(body.key || '') !== ADMIN_HASH) {
    return jsonOut({ success: false, message: 'Sandi salah.' });
  }

  if (body.action === 'uploadImage') {
    return handleImageUpload(body);
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  try {
    if (body.siswa) writeSiswa(ss, body.siswa);
    if (body.jadwal) writeJadwal(ss, body.jadwal);
    if (body.piket) writePiket(ss, body.piket);
    if (body.kas) writeKas(ss, body.kas);
    if (body.galeri) writeGaleri(ss, body.galeri);
    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, message: String(err) });
  }
}

function handleImageUpload(body) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const bytes = Utilities.base64Decode(body.imageBase64);
    const fileName = body.fileName || ('foto-' + new Date().getTime() + '.jpg');
    const blob = Utilities.newBlob(bytes, body.mimeType || 'image/jpeg', fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const url = 'https://lh3.googleusercontent.com/d/' + file.getId();
    return jsonOut({ success: true, url: url, fileId: file.getId() });
  } catch (err) {
    return jsonOut({ success: false, message: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sha256Hex(str) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return raw.map(b => ((b < 0 ? b + 256 : b).toString(16)).padStart(2, '0')).join('');
}

// ================= SISWA =================

function readSiswa(ss) {
  const sh = ss.getSheetByName('Siswa');
  const rows = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [, nama, absen, jk] = rows[i];
    if (!nama) continue;
    out.push({ nama: String(nama), absen: String(absen), jk: String(jk) });
  }
  return out;
}

function writeSiswa(ss, list) {
  const sh = ss.getSheetByName('Siswa');
  sh.clearContents();
  sh.appendRow(['No', 'Nama', 'Absen', 'JK']);
  list.forEach((s, i) => sh.appendRow([i + 1, s.nama, s.absen, s.jk]));
}

// ================= JADWAL =================

const HARI_LIST = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
const HARI_LABEL = { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat' };

function readJadwal(ss) {
  const sh = ss.getSheetByName('Jadwal');
  const rows = sh.getDataRange().getValues();
  const out = { senin: [], selasa: [], rabu: [], kamis: [], jumat: [] };
  for (let i = 1; i < rows.length; i++) {
    const [hari, jam, mapel, istirahat] = rows[i];
    const key = String(hari).toLowerCase().trim();
    if (!out[key]) continue;
    out[key].push({
      jam: String(jam),
      mapel: String(mapel),
      istirahat: istirahat === true || String(istirahat).toUpperCase() === 'TRUE'
    });
  }
  return out;
}

function writeJadwal(ss, obj) {
  const sh = ss.getSheetByName('Jadwal');
  sh.clearContents();
  sh.appendRow(['Hari', 'Jam', 'Mapel', 'Istirahat']);
  HARI_LIST.forEach(d => {
    (obj[d] || []).forEach(it => {
      sh.appendRow([HARI_LABEL[d], it.jam, it.mapel, it.istirahat ? 'TRUE' : 'FALSE']);
    });
  });
}

// ================= PIKET =================

function readPiket(ss) {
  const sh = ss.getSheetByName('Piket');
  const rows = sh.getDataRange().getValues();
  const out = {};
  for (let i = 1; i < rows.length; i++) {
    const [hari, kelompok, anggota, tugas] = rows[i];
    const key = String(hari).toLowerCase().trim();
    if (!key) continue;
    out[key] = {
      kelompok: String(kelompok || ''),
      anggota: String(anggota || '').split(',').map(s => s.trim()).filter(Boolean),
      tugas: String(tugas || '').split(',').map(s => s.trim()).filter(Boolean)
    };
  }
  return out;
}

function writePiket(ss, obj) {
  const sh = ss.getSheetByName('Piket');
  sh.clearContents();
  sh.appendRow(['Hari', 'Kelompok', 'Anggota (pisah koma)', 'Tugas (pisah koma)']);
  HARI_LIST.forEach(d => {
    const p = obj[d] || { kelompok: '', anggota: [], tugas: [] };
    sh.appendRow([HARI_LABEL[d], p.kelompok, (p.anggota || []).join(', '), (p.tugas || []).join(', ')]);
  });
}

// ================= KAS =================

function readKas(ss) {
  const sh = ss.getSheetByName('Kas');
  const rows = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [tanggal, keterangan, tipe, jumlah] = rows[i];
    if (!keterangan && !jumlah) continue;
    out.push({
      tanggal: String(tanggal || ''),
      keterangan: String(keterangan || ''),
      tipe: String(tipe || 'masuk'),
      jumlah: Number(jumlah) || 0
    });
  }
  return { transaksi: out };
}

function writeKas(ss, obj) {
  const sh = ss.getSheetByName('Kas');
  sh.clearContents();
  sh.appendRow(['Tanggal', 'Keterangan', 'Tipe', 'Jumlah']);
  (obj.transaksi || []).forEach(t => sh.appendRow([t.tanggal, t.keterangan, t.tipe, t.jumlah]));
}

// ================= GALERI =================

function readGaleri(ss) {
  const sh = ss.getSheetByName('Galeri');
  if (!sh) return [];
  const rows = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [url, caption] = rows[i];
    if (!url) continue;
    out.push({ url: String(url), caption: String(caption || '') });
  }
  return out;
}

function writeGaleri(ss, list) {
  let sh = ss.getSheetByName('Galeri');
  if (!sh) sh = ss.insertSheet('Galeri');
  sh.clearContents();
  sh.appendRow(['URL', 'Caption']);
  (list || []).forEach(g => sh.appendRow([g.url, g.caption || '']));
}
