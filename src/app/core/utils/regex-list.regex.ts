export class RegexList {
  // tslint:disable-next-line: quotemark
  public static emailRegex = new RegExp('^((?!\\.)[\\w-_.]*[^.])(@\\w+)(\\.\\w+(.\\w+)?[^.\\W])$');
  public static phoneRegex = new RegExp('^[0-9+-]+$');
  public static numberRegex = new RegExp('^[0-9]+$');
  public static nameRegex = new RegExp('^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ \'-]+$');
  public static password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/;
  public static detectSpecialChar = /[^0-9a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ \-.,]/g;
}
