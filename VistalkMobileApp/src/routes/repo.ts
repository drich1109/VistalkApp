import { getFromBaseApi, getFromMainApi, postToBaseApi, postToMainApi, putFormBaseApi, putToBaseApi, putToMainApi } from "../../api/apiService";
import { LoggedInUser, CallResultDto, Languages, UserDto, UserProfileDto, EditProfileVista, Content, ContentDefinition, ContentExample, ContentSyllable, PowerUp, SubscriptionDto, CoinBag, Musics, SectionDetails, UnitDetails, QuestionDetails, UserPowerUp } from "./type";
import CryptoJS from 'crypto-js';
import { VITE_MAIN_API } from '@env';
import { SectionListRenderItem } from "react-native";

const baseUrl = VITE_MAIN_API;

export async function loginUser(email:string, password:string)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    const result =  await getFromBaseApi<CallResultDto<LoggedInUser>>('loginVista', {email, hashedPassword});
    return result
}

export async function getLanguages()
{
    return await getFromMainApi<CallResultDto<Languages[]>>('getLanguages');
}

export async function register(user:UserDto)
{
    return await postToBaseApi<CallResultDto<object>>('registerUser', user)
}

export async function sendCodetoEmail(email:string)
{
    return await getFromBaseApi<CallResultDto<object>>('forgotPassword', {email})
}

export async function verifyCode(email:string, code:string)
{
    return await getFromBaseApi<CallResultDto<object>>('verifyCode', {email, code})
}

export async function updatePassword(email:string, password:string, currentPassword:string|null)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    let currenthashedPassword;
    if(currentPassword)
        currenthashedPassword = CryptoJS.MD5(currentPassword).toString();
    else currenthashedPassword = null

    return await putToBaseApi<CallResultDto<object>>('changePassword', {email, hashedPassword, currenthashedPassword})
}

export async function getUserLanguage(userID:number)
{
    return await getFromMainApi<CallResultDto<Languages>>('getUserLanguage', {userID});
}

export function getUserImageUrl(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getUserImage?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserDetails(userID:number)
{
    return await getFromMainApi<CallResultDto<UserProfileDto>>('getUserDetails', {userID});
}

export async function getIsEmailUsed(email:string)
{
    return await getFromBaseApi<CallResultDto<object>>('isEmailUse', {email});
}

export async function editVistaProfile(formData: FormData) {
    return await putFormBaseApi<CallResultDto<object>>('/editVistaProfile', formData);
}

export async function deactivateVistaAccount(userId:number) {
    return await putToBaseApi<CallResultDto<object>>('/deactivateVistaAccount', {userId});
}

export async function sendFeedback(userId:number, feedback:string) {
    return await postToMainApi<CallResultDto<object>>('/addfeedback', {userId, feedback});
}

export async function getContent(searchString: string,  offset:number, LIMIT:number)
{
    return await getFromMainApi<CallResultDto<Content[]>>('getContent', {searchString, offset, LIMIT});
}

export async function getContentById(contentId: number)
{
    return await getFromMainApi<CallResultDto<Content>>('getContentByID', {contentId});
}

export async function getContentSyllableById(contentId: number)
{
    return await getFromMainApi<CallResultDto<ContentSyllable[]>>('getContentSyllableByID', {contentId});
}

export async function getContentExampleById(contentId: number)
{
    return await getFromMainApi<CallResultDto<ContentExample[]>>('getContentExampleByID', {contentId});
}

export async function getContentDefinitionById(contentId: number)
{
    return await getFromMainApi<CallResultDto<ContentDefinition[]>>('getContentDefinitionByID', {contentId});
}

export function getContentPronunciation(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getContentPronunciation?fileName=${fileName}&t=${timestamp}`;
}

export function getSyllablePronunciation(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getSyllablePronunciation?fileName=${fileName}&t=${timestamp}`;
}

export async function getPowerUps()
{
    return await getFromMainApi<CallResultDto<PowerUp[]>>('getPowerUps');
}

export function getPowerupImage(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getItemImage?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserVCoin(userId: string) {
    return await getFromMainApi<CallResultDto<number>>('getUserVcoin', {userId});
}

export async function buyPowerUp(userId: string, itemId:number, quantity:number) {
    return await putToMainApi<CallResultDto<object>>('buyPowerUp', {userId, itemId, quantity});
}

export async function getSubscriptions()
{
    return await getFromMainApi<CallResultDto<SubscriptionDto[]>>('getSubscriptions');
}

export async function paymongoRedirect(amount:number, description:string)
{
    return await postToMainApi<{ url: string }>('paymongoRedirect', {
        amount,
        description,
    });
}

export async function buySubscription(userId:string, subscriptionId:number)
{
    return await postToMainApi<CallResultDto<object>>('buySubscription', {
        userId,
        subscriptionId,
    });
}

export async function getCoinBags()
{
    return await getFromMainApi<CallResultDto<CoinBag[]>>('getCoinBags');
}

export async function buyCoinBag(userId:string, coinBagId:number)
{
    return await postToMainApi<CallResultDto<object>>('buyCoinBag', {
        userId,
        coinBagId,
    });
}

export async function getMusic()
{
    
    const result = await getFromMainApi<CallResultDto<Musics[]>>('getMusic');
    console.log(result)
    return result;
}

export async function buyMusic(userId: string, itemId:number, quantity:number) {
    return await putToMainApi<CallResultDto<object>>('buyMusic', {userId, itemId, quantity});
}

export function getBackgroundMusic(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getBackgroundMusic?fileName=${fileName}&t=${timestamp}`;
}

export async function getSections(languageId:number)
{
    return await getFromMainApi<CallResultDto<SectionDetails[]>>('getSections', {languageId});
}

export async function getUnits(sectionId:number)
{
    return await getFromMainApi<CallResultDto<UnitDetails[]>>('getUnits', {sectionId});
}

export async function getUnitQuestions(unitId:number)
{
    return await getFromMainApi<CallResultDto<QuestionDetails[]>>('getUnitQuestions', {unitId});
}

export function getQuestionFiles(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getQuestionFiles?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserPowerUps(userID:string)
{
    return await getFromMainApi<CallResultDto<UserPowerUp[]>>('getUserPowerUp', {userID});
}