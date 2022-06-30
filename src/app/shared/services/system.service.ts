import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ImageType } from '@core/enum/image-type.enum';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';

import { ResponseService } from '@core/services/response.service';
import { ImageSnippetDto } from '@shared/dto/core/image.dto';
import { ImageService } from '@core/services/image.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '@core/services/http.service';
import { LoaderService } from '@core/services/loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Injectable()
export class SystemService {
  userLang: any;
  headerHtml = '';

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly rS: ResponseService,
    private readonly imageService: ImageService
  ) {}

  numericRegexp: string = '[-+]?[0-9]*[.,]?[0-9]+';
  integerRegexp: string = '[0-9]+';

  // converting FormControl value into number
  convertFormControlNumber = (control: AbstractControl[]) => {
    return control.map((single) => {
      return single.setValue(parseFloat(single?.value));
    });
  };

  // converting DateTime into YYYY-MM-DD Format
  convertDateToString = (dateTime: Date) => {
    return dateTime.toLocaleDateString('en-CA');
  };

  // check a object is empty or not; true returns for empty
  isObjectEmpty = (object: any) => {
    for (var key in object) {
      if (object.hasOwnProperty(key)) return false;
    }
    return true;
  };

  // Request File to Download
  downloadFile = (
    requestUrl: string,
    fileName: string = 'Merchant Sales History',
    fileExtension: string = 'xlsx'
  ) => {
    return this._httpClient
      .get(requestUrl, { responseType: 'blob' })
      .pipe(
        map((file: Blob) => {
          this.makeFileDownloaded(file, `${fileName}.${fileExtension}`);
        })
      )
      .subscribe(
        (res) => {
          //console.log(res);
          this.rS.message('File Downloaded Successfully', false);
        },
        (error) => {
          //console.log(error);
          this.rS.message('Failed To File Downloaded File !!!', true);
        }
      );
  };

  // make download action
  makeFileDownloaded(
    file: Blob,
    fileName: string = 'Merchant Sales History.xlsx'
  ): void {
    const blob: Blob = new Blob([file], { type: 'octet/stream' });
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    // a.setAttribute('download', fileName);
    // console.log(a);
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  getRandomElementFromArray = (
    responseArray: any[],
    randomNumber: number = 8
  ) => {
    var result = new Array(randomNumber),
      len = responseArray.length,
      taken = new Array(len);
    if (randomNumber > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (randomNumber--) {
      var x = Math.floor(Math.random() * len);
      result[randomNumber] = responseArray[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  enumToArray = (enumValues: any, startIndex: number = 1) => {
    // console.log(enumValues);

    var keys = Object.keys(enumValues);
    // console.log(keys);

    var keyArray = keys.slice(keys.length / 2);
    // console.log(keyArray);

    let returnArray = keyArray.map((element: any, index) => {
      let ele: any = {};
      ele['id'] = index + startIndex;
      ele['name'] = element;
      return ele;
    });

    // console.log(returnArray);
    return returnArray;
  };

  addDays = (numberOfDays: number = 1, fromDate = new Date()) => {
    let returnDate = new Date(fromDate);
    returnDate.setDate(returnDate.getDate() + numberOfDays);
    return returnDate;
  };

  checkLength($num: string | number) {
    if ($num.toString().length == 1) {
      return '0' + $num;
    } else {
      return $num;
    }
  }

  dateFormatter(
    date: string | number | Date,
    formate = 'yyyy-mm-dd',
    divider = '-'
  ) {
    if (date) {
      const dt = new Date(date);
      const mm = dt.getMonth() + 1;
      const dd = dt.getDate();
      const yyyy = dt.getFullYear();
      // console.log(yyyy + '-' + mm + '-' + dd)

      if (formate == 'mm-dd-yyyy') {
        return (
          this.checkLength(mm) + divider + this.checkLength(dd) + divider + yyyy
        );
      } else if (formate == 'dd-mm-yyyy') {
        return (
          this.checkLength(dd) + divider + this.checkLength(mm) + divider + yyyy
        );
      }
      return (
        yyyy + divider + this.checkLength(mm) + divider + this.checkLength(dd)
      );
    } else {
      return null;
    }
  }

  getImage = (
    imageName: any,
    imageType: ImageType = ImageType.PRODUCT_SMALL
  ) => {
    if (imageName.includes('http:') || imageName.includes('assets')) {
      return new ImageSnippetDto(imageName, new File(['fake'], 'fake.txt'));
    }

    return new ImageSnippetDto(
      this.imageService.loadImage(imageName, imageType),
      new File(['fake'], 'fake.txt')
    );
  };

  getImageSource = (
    imageName: any,
    imageType: ImageType = ImageType.PRODUCT_SMALL
  ) => {
    let imageObject = this.getImage(imageName, imageType);
    return imageObject.src;
  };

  attributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1];
    if (splittedParts[2] != 'default') {
      productAttributes += ', ' + splittedParts[2];
    }
    return productAttributes;
  };

  loadImage = (img: any, imageType: ImageType) => {
    let showSrc;
    if (
      img?.includes('http:') ||
      img?.includes('data:') ||
      img?.includes('assets')
    ) {
      showSrc = img;
    } else {
      showSrc = this.imageService.loadImage(img, imageType);
    }

    return showSrc;
  };

  public defaultPrintCustomCss: any = `
    @page { size: auto; }      
    a { color:#000000 !important; text-decoration:none;font-size:12px !important;}
    #printHtml table {border-collapse: collapse;width:100%;}
    #printHtml table td,#printHtml table th {font-size:12px !important;border:1px solid #222; padding: 5px; color:#000000 !important;text-align:left !important;}
  `;

  getDynamicNo() {
    let dNo = new Date().getTime();
    return this.transNumber(dNo);
  }

  transNumber(numberString: any, userLang: any = false) {
    /**** dss date number formate start here **** */
    if (numberString) {
      let numberConvertString = '' + numberString;
      var numberOfHypenLength = numberConvertString.match(new RegExp('-', 'g'));
      if (
        numberOfHypenLength &&
        numberOfHypenLength.length == 2 &&
        Date.parse(numberString) != NaN &&
        Date.parse(numberString) != undefined
      ) {
        let dt = new Date(numberString);
        let mm = '' + (dt.getMonth() + 1);
        if (parseInt(mm) < 10) {
          mm = '0' + mm;
        }
        let dd = '' + dt.getDate();
        if (parseInt(dd) < 10) {
          dd = '0' + dd;
        }
        let yyyy = dt.getFullYear();
        numberString = dd + '-' + mm + '-' + yyyy;
      }
    }
    /**** dss date number formate end here **** */

    if (numberString) {
      let bengaliNumber = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      let retString = '';
      numberString = numberString.toString();

      if (userLang === false) {
        userLang = this.userLang;
      }

      if (userLang == 'bn') {
        if (numberString.length) {
          for (let i = 0; i < numberString.length; ++i) {
            if (
              parseInt(numberString[i]) ||
              (numberString[i] == 0 && parseInt(numberString[i]) != NaN)
            ) {
              if (bengaliNumber[numberString[i]] != undefined) {
                retString += bengaliNumber[numberString[i]];
              } else {
                retString += numberString[i];
              }
            } else {
              retString += numberString[i];
            }
          }
          return retString;
        }
      }
    }

    return numberString;
  }

  // generatePrint(
  //   printTitle: any = '',
  //   printCustomCss: any = true,
  //   slectorId: string = 'printDiv',
  //   header: any = true,
  //   footer: any = true,
  //   removeClassName: any = 'removeArea',
  //   memorandumNo: any = ''
  // ) {
  //   let printContents = document.getElementById(slectorId)?.innerHTML;

  //   if (printContents) {
  //     var headContent = document.getElementsByTagName('head')[0].innerHTML;
  //     var newWindow = window.open();
  //     var printHtml = '';

  //     if (memorandumNo === true) {
  //       memorandumNo = this.getDynamicNo();
  //     }

  //     if (header === true) {
  //       this.headerHtml = `
  //       <table style="height: 200px;width: 100%; margin-bottom:10px;font-size:12px;">
  //           <tbody>
  //               <tr>
  //                 <td style="width: 20%;vertical-align: top;">
  //                     <div>
  //                         <div style="border: 1px solid #ccc;padding: 5px; text-align: center;">
  //                            <span></span>
  //                         </div>
  //                          <div style="margin-top: 50px;">
  //                             <span></span>
  //                          </div>
  //                     </div>
  //                 </td>
  //                 <td style="text-align: center;width: 60%;">
  //                     <img src="assets/img/bdlogo.png" alt="" style="width: 70px;height:auto;display: block;margin: 0 auto;margin-bottom:10px;" class="">
  //                     <div>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
  //                     <div>সমাজসেবা অধিদফতর</div>
  //                     <div>dss_address<br/>dss web address</div>
  //                     <div>${printTitle}</div>
  //                 </td>
  //                 <td style="text-align: right;width: 20%;vertical-align: top;">
  //                     <img src="assets/img/mujib_100_logo.jpg" alt="" style="width:100px;height: auto;margin-top: 0px;margin-bottom: 20px;" class="">
  //                     <div style="vertical-align: bottom;">Today Date</div>
  //                 </td>
  //               </tr>
  //         </tbody>
  //       </table>
  //       `;
  //       printHtml += this.headerHtml;
  //     } else if (header) {
  //       printHtml += header;
  //     }

  //     printHtml +=
  //       '<div id="printHtml" style="font-size:12px !important;">' +
  //       printContents +
  //       '</div>';

  //     if (footer === true) {
  //       printHtml += `
  //                     <table style="height: 50px;width: 100%;margin-top:100px;vertical-align: top;">
  //                       <tbody>
  //                           <tr>
  //                             <td>&nbsp;</td>
  //                             <td style="width:200px;text-align:left;font-size:12px;">
  //                               <hr style="border:1px solid #222;width:200px;" />
  //                               <div>form_name</div>
  //                               <div>form_dg</div>
  //                               <div>form_phone :</div>
  //                               <div>form_email :</div>
  //                             </td>
  //                           </tr>
  //                     </tbody>
  //                   </table>
  //                     `;
  //     } else if (footer) {
  //       printHtml += footer;
  //     }

  //     newWindow.document.body.innerHTML = printHtml;

  //     if (removeClassName) {
  //       // var elements = newWindow.document.getElementsByClassName(removeClassName);
  //       var elements = newWindow.document.querySelectorAll(
  //         '.' + removeClassName + ':not(.photo)'
  //       );

  //       if (elements.length !== undefined && elements.length > 0) {
  //         Array.prototype.forEach.call(elements, function (node) {
  //           node.parentNode.removeChild(node);
  //         });
  //       }

  //       // while (elements.length > 0) {
  //       //   elements[0].parentNode.removeChild(elements[0]);
  //       // }
  //     }

  //     newWindow.document.getElementsByTagName('head')[0].innerHTML =
  //       headContent;

  //     if (printCustomCss === true) {
  //       newWindow.document.head.insertAdjacentHTML(
  //         'beforeend',
  //         '<style>' + this.defaultPrintCustomCss + '</style>'
  //       );
  //     } else if (printCustomCss !== false) {
  //       newWindow.document.head.insertAdjacentHTML(
  //         'beforeend',
  //         '<style>' + printCustomCss + '</style>'
  //       );
  //     }

  //     setTimeout(function () {
  //       newWindow.focus();
  //       newWindow.print();
  //       // newWindow.close();
  //     }, 3000);
  //   }
  // }
}
