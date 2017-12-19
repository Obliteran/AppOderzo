import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

//plugin
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Toast } from '@ionic-native/toast';
import { Diagnostic } from '@ionic-native/diagnostic';


//pages
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/userpage/userpage';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { UserData } from '../providers/user-data';
import { AuthService } from '../pages/authservice/authservice';
import { ReportsPage } from '../pages/public_reports/public_reports';
import { NewReportPage } from '../pages/new_report/new_report';
import { ChooseCategoryPage } from '../pages/choose_category/choose_category';
import { ChooseProblemPage } from '../pages/choose_problem/choose_problem';
import { AddDescriptionPage } from '../pages/add_description/add_description';
import { ReportLocationPage } from '../pages/report_location/report_location';
import { UserReportsPage } from '../pages/user_reports/user_reports';

// modals
import { MyModal } from '../pages/public_reports/public_reports';
import { InfoBox } from '../pages/report_location/report_location';


@NgModule({
  declarations: [
    MyApp,
    UserPage,
    LoginPage,
    SignupPage,
    TutorialPage,
    HomePage,
    ReportsPage,
    MyModal,
    NewReportPage,
    ChooseCategoryPage,
    ChooseProblemPage,
    AddDescriptionPage,
    ReportLocationPage,
    UserReportsPage,
    InfoBox
 
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'HomePage', segment: 'home' },
        { component: ReportsPage, name: 'ReportsPage', segment: 'reports' },
        { component: TutorialPage, name: 'TutorialPage', segment: 'tutorial' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: UserPage, name: 'UserPage', segment: 'user' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: NewReportPage, name: 'NewReportPage', segment: 'newreport' },
        { component: ChooseProblemPage, name: 'ChooseCategoryPage', segment: 'choosecategory' },  
        { component: ChooseProblemPage, name: 'ChooseProblemPage', segment: 'chooseproblem' },
        { component: AddDescriptionPage, name: 'AddDescriptionPage', segment: 'addDescription' },
        { component: ReportLocationPage, name: 'ReportLocationPage', segment: 'reportLocation' },
        { component: UserReportsPage, name: 'UserReportsPage', segment: 'userReports' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UserPage,
    LoginPage,
    SignupPage,
    TutorialPage,
    HomePage,
    ReportsPage,
    MyModal,
    NewReportPage,
    ChooseCategoryPage,
    ChooseProblemPage,
    AddDescriptionPage,
    ReportLocationPage,
    UserReportsPage,
    InfoBox
    
    
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    
    UserData,
    AuthService,
    SplashScreen,
    Geolocation,
    Transfer,
    Camera,
    ImagePicker,
    SocialSharing,
    Toast,
    Diagnostic,
   
    
    
  ]
})
export class AppModule { }
