import React, { useEffect, useReducer, useState } from "react";
import API from "../api/axios";
import "./Warehouses.css";
import { toast } from "../components/toast";

import { LVL, toArr, ts }                    from "./warehouse/warehouseConstants.js";
import { MODAL_CLOSED, modalReducer, Modal } from "./warehouse/warehouseModal.jsx";
import WarehouseList                          from "./warehouse/WarehouseList.jsx";
import ZoneList                               from "./warehouse/ZoneList.jsx";
import RackList                               from "./warehouse/RackList.jsx";
import { BinGrid, BinDetail }                from "./warehouse/BinViews.jsx";
import WarehouseForm                          from "./warehouse/WarehouseForm.jsx";
import Pagination                             from "./warehouse/Pagination.jsx";

const PAGE_SIZE = 10;

/* ═══════════════════════════════════════════════
   Warehouses — main orchestrator
   Drill-down: Warehouse → Zone → Rack → Bin → Bin Detail
═══════════════════════════════════════════════ */
export default function Warehouses() {

  /* ── Navigation ── */
  const [level,   setLevel]   = useState(LVL.WH);
  const [selWH,   setSelWH]   = useState(null);
  const [selZone, setSelZone] = useState(null);
  const [selRack, setSelRack] = useState(null);
  const [selBin,  setSelBin]  = useState(null);

  /* ── Data ── */
  const [warehouses,   setWarehouses]   = useState([]);
  const [zones,        setZones]        = useState([]);
  const [racks,        setRacks]        = useState([]);
  const [bins,         setBins]         = useState([]);
  const [storageTypes, setStorageTypes] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);

  /* ── Pagination: count per level ── */
  const [whCount,   setWhCount]   = useState(0);
  const [zoneCount, setZoneCount] = useState(0);
  const [rackCount, setRackCount] = useState(0);
  const [binCount,  setBinCount]  = useState(0);

  /* ── Pagination: current page per level ── */
  const [whPage,   setWhPage]   = useState(1);
  const [zonePage, setZonePage] = useState(1);
  const [rackPage, setRackPage] = useState(1);
  const [binPage,  setBinPage]  = useState(1);

  /* ── Modal ── */
  const [m, dispatch] = useReducer(modalReducer, MODAL_CLOSED);

  /* ════════════════════════
     FETCH HELPERS
  ════════════════════════ */
  const extractData = (data) => ({
    items: toArr(data),
    count: data?.count ?? toArr(data).length,
  });

  /* ── Warehouses ── */
  const loadWarehouses = async (page = 1) => {
    setLoading(true);
    try {
      const [wRes, sRes] = await Promise.all([
        API.get(`warehouse/warehouses/?page=${page}&${ts()}`),
        API.get(`warehouse/storagetypes/?page_size=100&${ts()}`),
      ]);
      const { items, count } = extractData(wRes.data);
      setWarehouses(items);
      setWhCount(count);
      setWhPage(page);
      setStorageTypes(toArr(sRes.data));
    } catch (e) { console.error("[WH] loadWarehouses:", e); }
    finally { setLoading(false); }
  };

  /* ── Zones ── */
  const loadZones = async (wh, page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(
        `warehouse/zones/?warehouse=${wh.id}&page=${page}&${ts()}`
      );
      const { items, count } = extractData(res.data);
      setZones(items);
      setZoneCount(count);
      setZonePage(page);
    } catch (e) { console.error("[WH] loadZones:", e); }
    finally { setLoading(false); }
  };

  /* ── Racks ── */
  const loadRacks = async (zone, page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(
        `warehouse/racks/?zone=${zone.id}&page=${page}&${ts()}`
      );
      const { items, count } = extractData(res.data);
      setRacks(items);
      setRackCount(count);
      setRackPage(page);
    } catch (e) { console.error("[WH] loadRacks:", e); }
    finally { setLoading(false); }
  };

  /* ── Bins ── */
  const loadBins = async (rack, page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(
        `warehouse/bins/?rack=${rack.id}&page=${page}&${ts()}`
      );
      const { items, count } = extractData(res.data);
      setBins(items);
      setBinCount(count);
      setBinPage(page);
    } catch (e) { console.error("[WH] loadBins:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadWarehouses(); }, []); // eslint-disable-line

  /* ════════════════════════
     NAVIGATION
  ════════════════════════ */
  const goWH = () => { setLevel(LVL.WH); loadWarehouses(); };

  const goZone = (wh) => {
    setSelWH(wh); setLevel(LVL.ZONE); loadZones(wh);
  };

  const goRack = (zone) => {
    setSelZone(zone); setLevel(LVL.RACK); loadRacks(zone);
  };

  const goBins = (rack) => {
    setSelRack(rack); setLevel(LVL.BINS); loadBins(rack);
  };

  const goBinDetail = (bin) => {
    setSelBin(bin); setLevel(LVL.BIN_DETAIL);
  };

  const goBack = () => {
    if (level === LVL.ZONE)       goWH();
    if (level === LVL.RACK)       { setLevel(LVL.ZONE); loadZones(selWH); }
    if (level === LVL.BINS)       { setLevel(LVL.RACK); loadRacks(selZone); }
    if (level === LVL.BIN_DETAIL) setLevel(LVL.BINS);
  };

  const goToLevel = (lvl) => {
    if (lvl === LVL.WH)   goWH();
    if (lvl === LVL.ZONE) { setLevel(LVL.ZONE); loadZones(selWH); }
    if (lvl === LVL.RACK) { setLevel(LVL.RACK); loadRacks(selZone); }
    if (lvl === LVL.BINS) { setLevel(LVL.BINS); loadBins(selRack); }
  };

  const refresh = (lvl) => {
    if (lvl === LVL.WH)               loadWarehouses(whPage);
    if (lvl === LVL.ZONE && selWH)    loadZones(selWH, zonePage);
    if (lvl === LVL.RACK && selZone)  loadRacks(selZone, rackPage);
    if (lvl === LVL.BINS && selRack)  loadBins(selRack, binPage);
  };

  /* ════════════════════════
     PAGE CHANGE HANDLERS
  ════════════════════════ */
  const onWhPage   = (p) => loadWarehouses(p);
  const onZonePage = (p) => loadZones(selWH, p);
  const onRackPage = (p) => loadRacks(selZone, p);
  const onBinPage  = (p) => loadBins(selRack, p);

  /* ════════════════════════
     SAVE
  ════════════════════════ */
  const handleSave = async () => {
    let url, payload;

    if (m.lvl === LVL.WH) {
      url     = "warehouse/warehouses/";
      payload = { name: m.fName, location: m.fLoc };

    } else if (m.lvl === LVL.ZONE) {
      url     = "warehouse/zones/";
      payload = {
        warehouse:    selWH.id,
        name:         m.fZoneName,
        description:  m.fZoneDesc,
        storage_type: m.fStorageType || null,
      };

    } else if (m.lvl === LVL.RACK) {
      url     = "warehouse/racks/";
      payload = {
        zone:         selZone.id,
        rack_code:    m.fRackCode,
        max_capacity: Number(m.fMaxCap),
      };

    } else if (m.lvl === LVL.BINS) {
      url     = "warehouse/bins/";
      payload = {
        rack:             selRack.id,
        bin_code:         m.fBinCode,
        max_capacity:     Number(m.fMaxCap),
        current_capacity: Number(m.fCurCap),
        shelf:            m.fShelf,
        position:         m.fPos ? Number(m.fPos) : null,
        rfid:             m.fRfid,
      };
    } else { return; }

    setSaving(true);
    try {
      m.isEdit
        ? await API.put(`${url}${m.editId}/`, payload)
        : await API.post(url, payload);
      dispatch({ type: "CLOSE" });
      refresh(m.lvl);
    } catch (e) {
      console.error("[WH] save error:", e.response?.data || e.message);
      toast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ════════════════════════
     DELETE
  ════════════════════════ */
  const handleDelete = async (e, item, lvl) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item?")) return;
    const urls = {
      [LVL.WH]:   "warehouse/warehouses/",
      [LVL.ZONE]: "warehouse/zones/",
      [LVL.RACK]: "warehouse/racks/",
      [LVL.BINS]: "warehouse/bins/",
    };
    try {
      await API.delete(`${urls[lvl]}${item.id}/`);
      toast("Deleted", "success");
      refresh(lvl);
    } catch (e) {
      console.error("[WH] delete error:", e.response?.data || e.message);
      toast("Delete failed", "error");
    }
  };

  /* ════════════════════════
     BREADCRUMB
  ════════════════════════ */
  const crumbs = [{ label: "Warehouses", lvl: LVL.WH }];
  if (level >= LVL.ZONE        && selWH)   crumbs.push({ label: selWH.name,       lvl: LVL.ZONE });
  if (level >= LVL.RACK        && selZone) crumbs.push({ label: selZone.name,      lvl: LVL.RACK });
  if (level >= LVL.BINS        && selRack) crumbs.push({ label: selRack.rack_code, lvl: LVL.BINS });
  if (level === LVL.BIN_DETAIL && selBin)  crumbs.push({ label: selBin.bin_code,   lvl: LVL.BIN_DETAIL });

  /* ════════════════════════
     HEADER VALUES
  ════════════════════════ */
  let pageTitle = "Warehouses";
  let pageSub   = `${whCount} locations`;
  let btnLabel  = "+ Add Warehouse";
  let btnAction = () => dispatch({ type: "OPEN_ADD_WH" });

  if (level === LVL.ZONE) {
    pageTitle = selWH?.name || "";
    pageSub   = `${zoneCount} zones`;
    btnLabel  = "+ Add Zone";
    btnAction = () => dispatch({ type: "OPEN_ADD_ZONE", firstStorageTypeId: storageTypes[0]?.id });
  } else if (level === LVL.RACK) {
    pageTitle = selZone?.name || "";
    pageSub   = `${rackCount} racks · ${selWH?.name || ""}`;
    btnLabel  = "+ Add Rack";
    btnAction = () => dispatch({ type: "OPEN_ADD_RACK" });
  } else if (level === LVL.BINS) {
    pageTitle = selRack?.rack_code || "";
    pageSub   = `${binCount} bins · ${selZone?.name || ""}`;
    btnLabel  = "+ Add Bin";
    btnAction = () => dispatch({ type: "OPEN_ADD_BIN", rackId: selRack?.id });
  } else if (level === LVL.BIN_DETAIL) {
    pageTitle = `Bin ${selBin?.bin_code || ""}`;
    pageSub   = `${selWH?.name || ""} › ${selZone?.name || ""} › ${selRack?.rack_code || ""}`;
    btnLabel  = null;
    btnAction = null;
  }

  const modalTitle =
    m.isEdit
      ? `Edit ${["Warehouse","Zone","Rack","Bin",""][m.lvl] || ""}`
      : m.lvl === LVL.WH   ? "New Warehouse"
      : m.lvl === LVL.ZONE ? "New Zone"
      : m.lvl === LVL.RACK ? "New Rack"
      : "New Bin";

  /* ════════════════════════
     RENDER
  ════════════════════════ */
  return (
    <div className="wh-page">

      {/* ── Breadcrumb ── */}
      <div className="wh-breadcrumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={`crumb-${c.lvl}`}>
            {i > 0 && <span className="bc-sep">›</span>}
            <button type="button"
              className={`bc-btn ${i === crumbs.length - 1 ? "current" : ""}`}
              onClick={() => goToLevel(c.lvl)}
            >{c.label}</button>
          </React.Fragment>
        ))}
      </div>

      {/* ── Header ── */}
      <div className="wh-header">
        <div className="wh-header-left">
          {level > LVL.WH && (
            <button type="button" className="back-btn" onClick={goBack}>←</button>
          )}
          <div>
            <h1 className="wh-title">{pageTitle}</h1>
            <p className="wh-subtitle">{pageSub}</p>
          </div>
        </div>
        <div className="wh-header-right">
          {level === LVL.BIN_DETAIL && selBin && (
            <span className={`bin-status-pill ${selBin.is_available ? "avail" : "full"}`}>
              {selBin.is_available ? "Available" : "Occupied"}
            </span>
          )}
          {btnLabel && (
            <button type="button" className="btn-primary"
              onClick={(e) => { e.stopPropagation(); btnAction(); }}>
              {btnLabel}
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <>
          {level === LVL.WH && (
            <>
              <WarehouseList
                warehouses={warehouses}
                onDrill={goZone}
                onEdit={(e, w) => dispatch({ type: "OPEN_EDIT_WH", item: w })}
                onDelete={(e, w) => handleDelete(e, w, LVL.WH)}
              />
              <Pagination page={whPage} count={whCount}
                pageSize={PAGE_SIZE} onPage={onWhPage} />
            </>
          )}
          {level === LVL.ZONE && (
            <>
              <ZoneList
                zones={zones}
                onDrill={goRack}
                onEdit={(e, z) => dispatch({ type: "OPEN_EDIT_ZONE", item: z })}
                onDelete={(e, z) => handleDelete(e, z, LVL.ZONE)}
              />
              <Pagination page={zonePage} count={zoneCount}
                pageSize={PAGE_SIZE} onPage={onZonePage} />
            </>
          )}
          {level === LVL.RACK && (
            <>
              <RackList
                racks={racks}
                onDrill={goBins}
                onEdit={(e, r) => dispatch({ type: "OPEN_EDIT_RACK", item: r })}
                onDelete={(e, r) => handleDelete(e, r, LVL.RACK)}
              />
              <Pagination page={rackPage} count={rackCount}
                pageSize={PAGE_SIZE} onPage={onRackPage} />
            </>
          )}
          {level === LVL.BINS && (
            <>
              <BinGrid bins={bins} onDrill={goBinDetail} />
              <Pagination page={binPage} count={binCount}
                pageSize={PAGE_SIZE} onPage={onBinPage} />
            </>
          )}
          {level === LVL.BIN_DETAIL && (
            <BinDetail bin={selBin} />
          )}
        </>
      )}

      {/* ── Modal ── */}
      {m.open && (
        <Modal title={modalTitle}
          onClose={() => dispatch({ type: "CLOSE" })}
          onSave={handleSave} saving={saving}>
          <WarehouseForm m={m} dispatch={dispatch} storageTypes={storageTypes} />
        </Modal>
      )}

    </div>
  );
}