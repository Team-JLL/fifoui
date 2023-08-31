import {environment} from '../../environments/environment';

export class UrlConstants {

  public static api = environment.api;
  public static loginAppUrl = environment.login_app_url;

  /*controllers*/
  public static  fifoApi = UrlConstants.api +  'fifoApi/';
  public static  fifoFlow = UrlConstants.api +  'fifoFlow/';
  public static  fifoReport = UrlConstants.api +  'fifoReport/';

  /*API Controller*/
  public static getFifoMaster = UrlConstants.fifoApi + 'getFifoMaster'
  public static getDepotWiseAsmOrZonalManagers = UrlConstants.fifoApi + 'getDepotWiseAsmOrZonalManagers'
  public static getAllRequestedFifos = UrlConstants.fifoApi + 'getAllRequestedFifos'
  public static getAllBypassedRequestsForMDM = UrlConstants.fifoApi + 'getDataForFinalBypass'
  public static getCountData = UrlConstants.fifoApi + 'getCountData'
  public static setBypassFlagForSelectedRequests = UrlConstants.fifoApi + 'setBypassFlagForSelectedRequests'
  public static getSelectedRequestsForDetailSummary = UrlConstants.fifoApi + 'getSelectedRequestsForDetailSummary'
  public static getRequestHistory = UrlConstants.fifoApi + 'getRequestHistory'
  public static getRepositoryData = UrlConstants.fifoApi + 'getRepositoryData'
  public static BypassEventHistory = UrlConstants.fifoApi + 'getBypassEventHistory'
  public static getDataForCards = UrlConstants.fifoApi + 'getDataForCards'
  public static getBypassUserMapping = UrlConstants.fifoApi + 'getBypassUserMapping'
  public static deleteBypassUserMapping = UrlConstants.fifoApi + 'deleteBypassUserMapping'
  public static getDetailsForAddNewMapping = UrlConstants.fifoApi + 'getDetailsForAddNewMapping'
  public static addNewBypassMapping = UrlConstants.fifoApi + 'addNewBypassMapping'
  public static editBypassMapping = UrlConstants.fifoApi + 'editBypassMapping'

  /*Flow Controller */
  public static submitBypassRequest = UrlConstants.fifoFlow + 'BypassFromRequester'
  public static BypassFromLiquidation = UrlConstants.fifoFlow + 'BypassFromLiquidation'
  public static BypassFromApprovalFeasibility = UrlConstants.fifoFlow + 'BypassFromApprovalFeasibility'
  public static BypassFromMDM = UrlConstants.fifoFlow + 'BypassFromMDM'
  public static deleteRequestFromSelectedRequests = UrlConstants.fifoFlow + 'deleteRequestFromSelectedRequests'
  public static RejectionFromAllStage = UrlConstants.fifoFlow + 'RejectionFromAllStage'
  public static cancelRequest = UrlConstants.fifoFlow + 'cancelRequest'

  /*Report Controller */
  public static downloadFinalBypassReport = UrlConstants.fifoReport + 'downloadFinalBypassReport'
  public static downloadBypassHistoryReport = UrlConstants.fifoReport + 'downloadBypassHistoryReport'
  public static downloadFIFOMaster = UrlConstants.fifoReport + 'downloadFIFOMaster'





}
